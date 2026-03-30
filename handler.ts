// Twitter Automation (Local) - Browser automation skill
// Runs entirely locally using Puppeteer

interface TwitterAction {
  action: 'post' | 'reply' | 'like' | 'retweet' | 'search' | 'timeline' | 'follow' | 'unfollow' | 'quote' | 'bookmark';
  text?: string;
  tweet_id?: string;
  username?: string;
  query?: string;
  max_results?: number;
  reply_to?: string;
}

interface TwitterResult {
  success: boolean;
  action: string;
  data?: any;
  error?: string;
}

interface Tweet {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes?: number;
  retweets?: number;
  replies?: number;
}

// Browser instance cache (avoid repeated launches)
let browserInstance: any = null;
let pageInstance: any = null;

async function getBrowser() {
  // Dynamic import to avoid bundling issues
  const puppeteer = await import('puppeteer');
  
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.default.launch({
      headless: false, // Show browser window
      userDataDir: './twitter-profile', // Persist login state
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
  }
  return browserInstance;
}

async function getPage() {
  if (!pageInstance || pageInstance.isClosed()) {
    const browser = await getBrowser();
    pageInstance = await browser.newPage();
    
    // Set user agent to avoid detection
    await pageInstance.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
  }
  return pageInstance;
}

async function waitForTwitterLoad(page: any) {
  try {
    await page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 10000 });
  } catch (error) {
    throw new Error('Failed to load Twitter. Make sure you are logged in.');
  }
}

async function postTweet(page: any, text: string): Promise<any> {
  await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for compose box
  await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 5000 });
  
  // Type tweet text
  await page.type('[data-testid="tweetTextarea_0"]', text, { delay: 50 });
  
  // Wait a bit for UI to update
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Click tweet button
  await page.click('[data-testid="tweetButton"]');
  
  // Wait for navigation or success indicator
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return { text, posted: true };
}

async function likeTweet(page: any, tweetId: string): Promise<any> {
  const url = `https://twitter.com/i/web/status/${tweetId}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for like button
  await page.waitForSelector('[data-testid="like"]', { timeout: 5000 });
  
  // Check if already liked
  const isLiked = await page.$('[data-testid="unlike"]');
  
  if (!isLiked) {
    await page.click('[data-testid="like"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return { tweet_id: tweetId, liked: true, was_already_liked: !!isLiked };
}

async function retweetTweet(page: any, tweetId: string): Promise<any> {
  const url = `https://twitter.com/i/web/status/${tweetId}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Click retweet button
  await page.waitForSelector('[data-testid="retweet"]', { timeout: 5000 });
  await page.click('[data-testid="retweet"]');
  
  // Wait for menu and click confirm
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.waitForSelector('[data-testid="retweetConfirm"]', { timeout: 3000 });
  await page.click('[data-testid="retweetConfirm"]');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { tweet_id: tweetId, retweeted: true };
}

async function searchTweets(page: any, query: string, maxResults: number = 10): Promise<any> {
  const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for tweets to load
  await page.waitForSelector('[data-testid="tweet"]', { timeout: 5000 });
  
  // Scroll to load more tweets
  for (let i = 0; i < Math.ceil(maxResults / 10); i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Extract tweet data
  const tweets = await page.evaluate((max: number) => {
    const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
    const results: any[] = [];
    
    for (let i = 0; i < Math.min(tweetElements.length, max); i++) {
      const el = tweetElements[i];
      const textEl = el.querySelector('[data-testid="tweetText"]');
      const authorEl = el.querySelector('[data-testid="User-Name"]');
      const timeEl = el.querySelector('time');
      
      if (textEl && authorEl) {
        results.push({
          text: textEl.textContent || '',
          author: authorEl.textContent || '',
          timestamp: timeEl?.getAttribute('datetime') || '',
        });
      }
    }
    
    return results;
  }, maxResults);
  
  return { query, count: tweets.length, tweets };
}

async function getTimeline(page: any, maxResults: number = 20): Promise<any> {
  await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for timeline
  await page.waitForSelector('[data-testid="tweet"]', { timeout: 5000 });
  
  // Scroll to load more
  for (let i = 0; i < Math.ceil(maxResults / 10); i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Extract tweets
  const tweets = await page.evaluate((max: number) => {
    const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
    const results: any[] = [];
    
    for (let i = 0; i < Math.min(tweetElements.length, max); i++) {
      const el = tweetElements[i];
      const textEl = el.querySelector('[data-testid="tweetText"]');
      const authorEl = el.querySelector('[data-testid="User-Name"]');
      const timeEl = el.querySelector('time');
      
      if (textEl && authorEl) {
        results.push({
          text: textEl.textContent || '',
          author: authorEl.textContent || '',
          timestamp: timeEl?.getAttribute('datetime') || '',
        });
      }
    }
    
    return results;
  }, maxResults);
  
  return { count: tweets.length, tweets };
}

async function followUser(page: any, username: string): Promise<any> {
  const url = `https://twitter.com/${username}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for follow button
  await page.waitForSelector('[data-testid*="follow"]', { timeout: 5000 });
  
  // Check if already following
  const isFollowing = await page.$('[data-testid="unfollow"]');
  
  if (!isFollowing) {
    await page.click('[data-testid*="follow"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return { username, followed: true, was_already_following: !!isFollowing };
}

async function unfollowUser(page: any, username: string): Promise<any> {
  const url = `https://twitter.com/${username}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await waitForTwitterLoad(page);
  
  // Wait for unfollow button
  await page.waitForSelector('[data-testid="unfollow"]', { timeout: 5000 });
  await page.click('[data-testid="unfollow"]');
  
  // Confirm unfollow
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.waitForSelector('[data-testid="confirmationSheetConfirm"]', { timeout: 3000 });
  await page.click('[data-testid="confirmationSheetConfirm"]');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { username, unfollowed: true };
}

export async function run(input: TwitterAction): Promise<TwitterResult> {
  try {
    const page = await getPage();
    let result: any;
    
    switch (input.action) {
      case 'post':
        if (!input.text) throw new Error('Missing required field: text');
        result = await postTweet(page, input.text);
        break;
        
      case 'like':
        if (!input.tweet_id) throw new Error('Missing required field: tweet_id');
        result = await likeTweet(page, input.tweet_id);
        break;
        
      case 'retweet':
        if (!input.tweet_id) throw new Error('Missing required field: tweet_id');
        result = await retweetTweet(page, input.tweet_id);
        break;
        
      case 'search':
        if (!input.query) throw new Error('Missing required field: query');
        result = await searchTweets(page, input.query, input.max_results || 10);
        break;
        
      case 'timeline':
        result = await getTimeline(page, input.max_results || 20);
        break;
        
      case 'follow':
        if (!input.username) throw new Error('Missing required field: username');
        result = await followUser(page, input.username);
        break;
        
      case 'unfollow':
        if (!input.username) throw new Error('Missing required field: username');
        result = await unfollowUser(page, input.username);
        break;
        
      default:
        throw new Error(`Unknown action: ${input.action}`);
    }
    
    return {
      success: true,
      action: input.action,
      data: result
    };
    
  } catch (error: any) {
    return {
      success: false,
      action: input.action,
      error: error.message
    };
  }
}

export default run;
