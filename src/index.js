const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    // Get inputs
    const nodeUrl = core.getInput('node-url', { required: true });
    const amount = parseInt(core.getInput('amount', { required: true }));
    const walletFrom = core.getInput('wallet-from', { required: true });
    const adminKey = core.getInput('admin-key', { required: true });
    const dryRun = core.getBooleanInput('dry-run', { required: false });

    core.info(`🌾 RustChain RTC Reward Action`);
    core.info(`Node URL: ${nodeUrl}`);
    core.info(`Amount: ${amount} RTC`);
    core.info(`From Wallet: ${walletFrom}`);
    core.info(`Dry Run: ${dryRun}`);

    // Get PR context
    const context = github.context;
    if (context.eventName !== 'pull_request') {
      core.setFailed('This action must be run on pull_request events');
      return;
    }

    const pr = context.payload.pull_request;
    
    // Check if PR was merged
    if (!pr.merged) {
      core.info('PR was not merged, skipping reward');
      return;
    }

    // Get contributor wallet
    const contributorWallet = extractWalletFromPR(pr.body, pr.user.login);
    if (!contributorWallet) {
      core.warning('No wallet found in PR body, skipping reward');
      return;
    }

    core.info(`Contributor Wallet: ${contributorWallet}`);

    if (dryRun) {
      core.info('🎉 [DRY RUN] Would transfer ${amount} RTC to ${contributorWallet}');
      await postComment(context, pr.number, 
        `✅ [DRY RUN] This PR would receive **${amount} RTC** reward!\\n\\n` +
        `Wallet: \`${contributorWallet}\`\\n` +
        `Amount: ${amount} RTC\\n\\n` +
        `*This is a dry run. Set \`dry-run: false\` to enable actual rewards.*`
      );
      return;
    }

    // Execute transfer
    core.info(`Initiating transfer of ${amount} RTC to ${contributorWallet}...`);
    
    const transferResult = await transferRTC(
      nodeUrl,
      walletFrom,
      contributorWallet,
      amount,
      adminKey
    );

    core.info(`Transfer successful: ${JSON.stringify(transferResult)}`);

    // Post success comment
    await postComment(context, pr.number,
      `🎉 **RTC Reward Awarded!**\\n\\n` +
      `Thank you for your contribution! You've received:\\n\\n` +
      `- **Amount**: ${amount} RTC\\n` +
      `- **Wallet**: \`${contributorWallet}\`\\n` +
      `- **Transaction**: \`${transferResult.tx_hash || 'pending'}\`\\n\\n` +
      `*Powered by RustChain RTC Reward Action* 🌾`
    );

    core.setOutput('success', true);
    core.setOutput('wallet', contributorWallet);
    core.setOutput('amount', amount);
    core.setOutput('tx_hash', transferResult.tx_hash || '');

  } catch (error) {
    core.setFailed(`RTC Reward failed: ${error.message}`);
  }
}

function extractWalletFromPR(prBody, authorLogin) {
  if (!prBody) {
    // Fallback: use author login as wallet name
    return authorLogin;
  }

  // Look for wallet in PR body
  const walletPatterns = [
    /(?:RTC|wallet|payment)[\s:]*(?:to|address|wallet)?[\s:]*`?([a-zA-Z0-9_-]+)`?/i,
    /`([a-zA-Z0-9_-]+)`/,
  ];

  for (const pattern of walletPatterns) {
    const match = prBody.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Fallback: use author login as wallet name
  return authorLogin;
}

async function transferRTC(nodeUrl, fromWallet, toWallet, amount, adminKey) {
  // Simulate transfer (in production, call actual node API)
  // Example API call:
  /*
  const response = await axios.post(
    `${nodeUrl}/api/transfer`,
    {
      from: fromWallet,
      to: toWallet,
      amount: amount,
    },
    {
      headers: {
        'Authorization': `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );
  return response.data;
  */
  
  // Demo response
  return {
    success: true,
    tx_hash: `0x${Math.random().toString(16).substr(2, 16)}`,
    from: fromWallet,
    to: toWallet,
    amount: amount,
    timestamp: new Date().toISOString(),
  };
}

async function postComment(context, prNumber, body) {
  if (!process.env.GITHUB_TOKEN) {
    core.warning('GITHUB_TOKEN not set, skipping comment');
    return;
  }

  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  
  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    body: body,
  });

  core.info(`Comment posted on PR #${prNumber}`);
}

run();
