# Twitter Automation (Local)

> Automate Twitter actions using your local browser. Use when you need to post tweets, like, retweet, search, or manage your Twitter account without API keys. Runs entirely locally with your logged-in browser session. Handles posting, engagement, search, and timeline reading.

[![License: MIT-0](https://img.shields.io/badge/License-MIT--0-blue.svg)](LICENSE)
[![Claw0x](https://img.shields.io/badge/Powered%20by-Claw0x-orange)](https://claw0x.com)
[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-green)](https://openclaw.org)

## What is This?

This is a native skill for **OpenClaw** and other AI agents. Skills are modular capabilities that agents can install and use instantly - no complex API setup, no managing multiple provider keys.

Built for OpenClaw, compatible with Claude, GPT-4, and other agent frameworks.

## Installation

### For OpenClaw Users

Simply tell your agent:

```
Install the "Twitter Automation (Local)" skill from Claw0x
```

Or use this connection prompt:

```
Add skill: twitter-automation-local
Platform: Claw0x
Get your API key at: https://claw0x.com
```

### For Other Agents (Claude, GPT-4, etc.)

1. Get your free API key at [claw0x.com](https://claw0x.com) (no credit card required)
2. Add to your agent's configuration:
   - Skill name: `twitter-automation-local`
   - Endpoint: `https://claw0x.com/v1/call`
   - Auth: Bearer token with your Claw0x API key

### Via CLI

```bash
npx @claw0x/cli add twitter-automation-local
```

---


# Twitter Automation (Local)

**Local skill by [Claw0x](https://claw0x.com)** — runs entirely in your OpenClaw agent using your local browser.

> **Runs locally.** No Twitter API key required ($0 vs $100/month). Uses your logged-in browser session. Complete privacy.

## What It Does

Automate Twitter/X actions using browser automation:
- ✅ Post tweets, replies, quotes
- ✅ Like, retweet, bookmark
- ✅ Follow/unfollow users
- ✅ Search tweets
- ✅ Read timeline, mentions, notifications
- ✅ Extract tweet data

**No $100/month Twitter API fee. No external API calls. 100% local.**

## Prerequisites

**None.** Just:
1. Install the skill: `openclaw skill add twitter-automation-local`
2. Make sure you're logged into Twitter in your default browser
3. Use it

The skill will launch a browser window and use your existing Twitter session.

## Quick Reference

| When This Happens | Do This | What You Get |
|-------------------|---------|--------------|
| Need to post a tweet | `action: 'post', text: '...'` | Tweet posted successfully |
| Want to like a tweet | `action: 'like', tweet_id: '...'` | Tweet liked |
| Search for tweets | `action: 'search', query: '...'` | Array of matching tweets |
| Read your timeline | `action: 'timeline'` | Recent tweets from your feed |
| Follow a user | `action: 'follow', username: '...'` | User followed |

## 5-Minute Quickstart

### Step 1: Install (30 seconds)
```bash
openclaw skill add twitter-automation-local
```

### Step 2: Make sure you're logged into Twitter (1 minute)
The skill will launch a browser window. If you're not logged in, log in once and the session will be saved.

### Step 3: Post your first tweet (1 minute)
```typescript
const result = await agent.run('twitter-automation-local', {
  action: 'post',
  text: 'Hello from OpenClaw! 🤖 #AI #Automation'
});
```

### Step 4: Get Result (instant)
```json
{
  "success": true,
  "action": "post",
  "data": {
    "text": "Hello from OpenClaw! 🤖 #AI #Automation",
    "posted": true
  }
}
```

## Real-World Use Cases

### Scenario 1: Social Media Manager Agent
**Problem**: Need to post scheduled tweets without paying $100/month for Twitter API  
**Solution**: Use this skill to automate posting  
**Result**: Save $1,200/year, post unlimited tweets

**Example**:
```typescript
// Schedule daily tips
const tips = [
  'Always test your code before deploying',
  'Use version control for everything',
  'Document your APIs thoroughly'
];

for (const tip of tips) {
  await agent.run('twitter-automation-local', {
    action: 'post',
    text: `💡 Daily Dev Tip: ${tip} #DevTips`
  });
  
  // Wait 8 hours between posts
  await sleep(8 * 60 * 60 * 1000);
}
```

### Scenario 2: Research Agent
**Problem**: Need to search Twitter for market research and sentiment analysis  
**Solution**: Use search action to gather tweets  
**Result**: Real-time market insights without API costs

**Example**:
```typescript
// Research AI agent sentiment
const result = await agent.run('twitter-automation-local', {
  action: 'search',
  query: 'AI agents',
  max_results: 100
});

// Analyze sentiment
const tweets = result.data.tweets;
const positive = tweets.filter(t => 
  t.text.includes('amazing') || t.text.includes('great')
).length;

console.log(`Positive sentiment: ${(positive / tweets.length * 100).toFixed(1)}%`);
```

### Scenario 3: Engagement Bot
**Problem**: Want to auto-like tweets from specific users to build relationships  
**Solution**: Search + like automation  
**Result**: Automated engagement, grow your network

**Example**:
```typescript
// Auto-engage with AI community
const users = ['@OpenAI', '@AnthropicAI', '@GoogleAI'];

for (const user of users) {
  // Search their recent tweets
  const result = await agent.run('twitter-automation-local', {
    action: 'search',
    query: `from:${user}`,
    max_results: 5
  });
  
  // Like each tweet
  for (const tweet of result.data.tweets) {
    await agent.run('twitter-automation-local', {
      action: 'like',
      tweet_id: tweet.id
    });
  }
}
```

### Scenario 4: Content Curator Agent
**Problem**: Need to curate and retweet relevant content  
**Solution**: Search + retweet automation  
**Result**: Automated content curation

**Example**:
```typescript
// Curate AI news
const result = await agent.run('twitter-automation-local', {
  action: 'search',
  query: 'AI breakthrough',
  max_results: 10
});

// Retweet top tweets
for (const tweet of result.data.tweets.slice(0, 3)) {
  await agent.run('twitter-automation-local', {
    action: 'retweet',
    tweet_id: tweet.id
  });
}
```

## Integration Recipes

### OpenClaw Agent
```typescript
import { OpenClawAgent } from '@openclaw/sdk';

const agent = new OpenClawAgent();

// Post a tweet
const result = await agent.run('twitter-automation-local', {
  action: 'post',
  text: 'Automated tweet from my OpenClaw agent! 🚀'
});

console.log('Tweet posted:', result.data);
```

### LangChain Agent
```python
from langchain.agents import Tool

twitter_tool = Tool(
    name="twitter_automation",
    func=lambda input: agent.run('twitter-automation-local', input),
    description="Automate Twitter actions using local browser. Actions: post, like, retweet, search, timeline, follow, unfollow"
)

# Use in agent
agent.run("Post a tweet about AI agents")
```

### Custom Agent
```javascript
const TwitterAgent = {
  async post(text) {
    return await agent.run('twitter-automation-local', {
      action: 'post',
      text
    });
  },
  
  async search(query, maxResults = 10) {
    return await agent.run('twitter-automation-local', {
      action: 'search',
      query,
      max_results: maxResults
    });
  },
  
  async engage(username) {
    // Follow user
    await agent.run('twitter-automation-local', {
      action: 'follow',
      username
    });
    
    // Like their recent tweets
    const tweets = await this.search(`from:@${username}`, 5);
    for (const tweet of tweets.data.tweets) {
      await agent.run('twitter-automation-local', {
        action: 'like',
        tweet_id: tweet.id
      });
    }
  }
};
```

## Input Schema

```typescript
interface TwitterAction {
  action: 'post' | 'reply' | 'like' | 'retweet' | 'search' | 'timeline' | 'follow' | 'unfollow';
  
  // For post/reply
  text?: string;
  
  // For reply/like/retweet
  tweet_id?: string;
  
  // For search
  query?: string;
  max_results?: number; // default: 10
  
  // For follow/unfollow
  username?: string;
}
```

## Output Schema

```typescript
interface TwitterResult {
  success: boolean;
  action: string;
  data?: {
    // For post
    text?: string;
    posted?: boolean;
    
    // For like/retweet
    tweet_id?: string;
    liked?: boolean;
    retweeted?: boolean;
    was_already_liked?: boolean;
    
    // For search/timeline
    query?: string;
    count?: number;
    tweets?: Array<{
      text: string;
      author: string;
      timestamp: string;
    }>;
    
    // For follow/unfollow
    username?: string;
    followed?: boolean;
    unfollowed?: boolean;
    was_already_following?: boolean;
  };
  error?: string;
}
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to load Twitter` | Not logged in | Log into Twitter in the browser window |
| `Missing required field: text` | No text provided for post | Provide text parameter |
| `Missing required field: tweet_id` | No tweet_id for like/retweet | Provide tweet_id parameter |
| `Missing required field: username` | No username for follow/unfollow | Provide username parameter |
| `Unknown action` | Invalid action type | Use valid action: post, like, retweet, search, timeline, follow, unfollow |

## Why Use This Instead of Twitter API?

| Feature | Twitter API | This Skill |
|---------|-------------|------------|
| **Cost** | $100/month | **Free** |
| **Setup** | Complex OAuth, developer account | **Just log in** |
| **Privacy** | Data sent to Twitter API servers | **100% local** |
| **Rate Limits** | 50 tweets/day (Basic tier) | **Your browser limits** |
| **Maintenance** | API changes, token refresh | **Auto-updates** |
| **Learning Curve** | OAuth, API docs, rate limits | **Simple actions** |

## Technical Details

- **Browser**: Uses Puppeteer (Chrome/Chromium)
- **Session**: Reuses your logged-in browser profile (saved in `./twitter-profile`)
- **Performance**: ~2-5 seconds per action
- **Privacy**: No data leaves your machine
- **Dependencies**: Puppeteer (auto-installed with skill)
- **Headless**: Runs in visible mode (you can see what it's doing)

## Limitations & Best Practices

### Limitations
- ⚠️ Requires Chrome/Chromium to be installed
- ⚠️ Slower than API (2-5s vs <1s per action)
- ⚠️ May break if Twitter changes UI (we update regularly)
- ⚠️ Not suitable for high-volume automation (>100 actions/hour)
- ⚠️ Browser window will be visible during operations

### Best Practices
- ✅ Use responsibly to avoid account suspension
- ✅ Add delays between actions (1-2 seconds minimum)
- ✅ Don't exceed 50-100 actions per hour
- ✅ Log in once, session persists automatically
- ✅ Keep skill updated for Twitter UI changes

### Rate Limiting Recommendations
```typescript
// Good: Reasonable delays
for (const tweet of tweets) {
  await agent.run('twitter-automation-local', { action: 'like', tweet_id: tweet.id });
  await sleep(2000); // 2 second delay
}

// Bad: Too fast, may trigger rate limits
for (const tweet of tweets) {
  await agent.run('twitter-automation-local', { action: 'like', tweet_id: tweet.id });
  // No delay - risky!
}
```

## Troubleshooting

### Browser doesn't launch
**Solution**: Make sure Chrome/Chromium is installed. Install with:
```bash
# macOS
brew install --cask google-chrome

# Ubuntu/Debian
sudo apt-get install chromium-browser

# Windows
# Download from https://www.google.com/chrome/
```

### "Failed to load Twitter" error
**Solution**: The skill will open a browser window. Log into Twitter manually in that window. The session will be saved for future use.

### Actions are slow
**Solution**: This is normal. Browser automation is slower than API calls but much cheaper. Expect 2-5 seconds per action.

### Twitter UI changed
**Solution**: Update the skill to the latest version:
```bash
openclaw skill update twitter-automation-local
```

## About Claw0x

This skill is provided by [Claw0x](https://claw0x.com), the native skills layer for AI agents.

**Why Claw0x?**
- **Free skills**: Like this one, no API costs
- **Paid skills**: When you need cloud services
- **Unified billing**: One key for all skills
- **Quality control**: Security scanned, tested

**Cloud version available**: For users who need centralized management and don't want to run browsers locally, a cloud version is available at [claw0x.com/skills/twitter-automation](https://claw0x.com/skills/twitter-automation).

**GitHub**: [github.com/claw0x/twitter-automation-local](https://github.com/claw0x/twitter-automation-local)

**Explore more skills**: [claw0x.com/skills](https://claw0x.com/skills)

## License

MIT-0 (Public Domain) - Use freely, no attribution required.

## Disclaimer

This skill automates browser interactions with Twitter/X. Use responsibly and in accordance with Twitter's Terms of Service. The authors are not responsible for account suspensions or violations of Twitter's policies. Use at your own risk.


---

## About Claw0x

Claw0x is the native skills layer for AI agents - not just another API marketplace.

**Why Claw0x?**
- **One key, all skills** - Single API key for 50+ production-ready skills
- **Pay only for success** - Failed calls (4xx/5xx) are never charged
- **Built for OpenClaw** - Native integration with the OpenClaw agent framework
- **Zero config** - No upstream API keys to manage, we handle all third-party auth

**For Developers:**
- [Browse all skills](https://claw0x.com/skills)
- [Sell your own skills](https://claw0x.com/docs/sell)
- [API Documentation](https://claw0x.com/docs/api-reference)
- [OpenClaw Integration Guide](https://claw0x.com/docs/openclaw)

## Links

- [Claw0x Platform](https://claw0x.com)
- [OpenClaw Framework](https://openclaw.org)
- [Skill Documentation](https://claw0x.com/skills/twitter-automation-local)
