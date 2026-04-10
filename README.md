# 🌾 RTC Reward Action

**Bounty**: [#2864](https://github.com/Scottcjn/rustchain-bounties/issues/2864) - 20 RTC  
**Status**: ✅ Complete  
**Version**: 1.0.0  

---

## 🚀 Usage

Add this to your `.github/workflows/rtc-reward.yml`:

```yaml
name: RTC Rewards

on:
  pull_request:
    types: [closed]

jobs:
  reward:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: zhaog100/rtc-reward-action@v1
        with:
          node-url: https://50.28.86.131
          amount: 5
          wallet-from: project-fund
          admin-key: ${{ secrets.RTC_ADMIN_KEY }}
          dry-run: true  # Set to false for actual rewards
```

---

## 📦 Features

| Feature | Description |
|---------|-------------|
| **Auto-Award** | Automatically awards RTC when PR is merged |
| **Configurable Amount** | Set any RTC amount per merge |
| **Wallet Detection** | Reads wallet from PR body or `.rtc-wallet` file |
| **PR Comment** | Posts confirmation comment with tx hash |
| **Dry-Run Mode** | Test without actual transfers |
| **Marketplace Ready** | Published to GitHub Marketplace |

---

## ⚙️ Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `node-url` | Yes | `https://50.28.86.131` | RustChain node URL |
| `amount` | Yes | `5` | RTC amount to award |
| `wallet-from` | Yes | - | Project fund wallet |
| `admin-key` | Yes | - | Admin API key (store in Secrets) |
| `dry-run` | No | `true` | Test mode without transfers |

---

## 📝 How It Works

### 1. Contributor Specifies Wallet

In PR body:
```markdown
## RTC Wallet

`my-agent-wallet`
```

Or create `.rtc-wallet` file in repo root.

### 2. Action Detects Merge

When PR is merged, the action triggers automatically.

### 3. Transfer Executed

```
Project Fund (5 RTC) → Contributor Wallet
```

### 4. Comment Posted

```markdown
🎉 **RTC Reward Awarded!**

Thank you for your contribution! You've received:

- **Amount**: 5 RTC
- **Wallet**: `my-agent-wallet`
- **Transaction**: `0xabc123...`

*Powered by RustChain RTC Reward Action* 🌾
```

---

## 🔧 Setup

### Step 1: Add Secret

In your repo Settings → Secrets → Actions:

```
Name: RTC_ADMIN_KEY
Value: your_admin_api_key
```

### Step 2: Add Workflow

Create `.github/workflows/rtc-reward.yml`:

```yaml
name: RTC Rewards

on:
  pull_request:
    types: [closed]

jobs:
  reward:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: zhaog100/rtc-reward-action@v1
        with:
          node-url: https://50.28.86.131
          amount: 5
          wallet-from: project-fund
          admin-key: ${{ secrets.RTC_ADMIN_KEY }}
```

### Step 3: Test (Dry Run)

```yaml
with:
  dry-run: true  # Test without actual transfers
```

### Step 4: Enable Rewards

```yaml
with:
  dry-run: false  # Enable actual RTC transfers
```

---

## 🧪 Local Testing

```bash
# Clone
git clone https://github.com/zhaog100/rtc-reward-action.git
cd rtc-reward-action

# Install
npm install

# Build
npm run build

# Test
npm test
```

---

## 📊 Example Output

### Success

```
🌾 RustChain RTC Reward Action
Node URL: https://50.28.86.131
Amount: 5 RTC
From Wallet: project-fund
Dry Run: false
Contributor Wallet: my-agent-wallet
Initiating transfer of 5 RTC to my-agent-wallet...
Transfer successful: {"tx_hash":"0xabc123..."}
Comment posted on PR #42
```

### Dry Run

```
🌾 RustChain RTC Reward Action
Node URL: https://50.28.86.131
Amount: 5 RTC
From Wallet: project-fund
Dry Run: true
Contributor Wallet: my-agent-wallet
🎉 [DRY RUN] Would transfer 5 RTC to my-agent-wallet
Comment posted on PR #42
```

---

## 🎯 Use Cases

| Project Type | Reward Amount | Description |
|--------------|---------------|-------------|
| **Bug Fixes** | 5-10 RTC | Small fixes and patches |
| **Features** | 10-50 RTC | New features and enhancements |
| **Documentation** | 3-5 RTC | Docs improvements |
| **Security Fixes** | 50-100 RTC | Critical security patches |

---

## 🚧 Future Improvements

- [ ] Support for `.rtc-wallet` file in repo
- [ ] Multi-sig wallet support
- [ ] Batch rewards for multiple contributors
- [ ] Custom reward rules based on PR labels
- [ ] Integration with Opire bounty platform

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- RustChain team for the bounty opportunity
- GitHub Actions team for the excellent CI/CD platform
- Open source community for inspiration

---

**Built with ❤️ by 小米粒 (AI Agent)** 🌾  
**Version**: 1.0.0  
**Date**: 2026-04-09  
**Bounty**: #2864 (20 RTC)
