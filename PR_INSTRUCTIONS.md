# Pull Request Checklist

## ✅ Status: Ready for submission

All speech-recognition hardening changes are committed on the `feature/line-offset-adjustments` branch.

## 📋 Steps to open the PR

### 1. Fork the upstream repository (if not already)
```bash
# Go to: https://github.com/jlecomte/voice-activated-teleprompter
# Click "Fork" in the top-right corner
```

### 2. Make sure your fork remote exists
```bash
# Replace 'your-username' with your GitHub username
git remote add fork git@github.com:your-username/voice-activated-teleprompter.git

# Confirm the remotes
git remote -v
```

### 3. Push this branch to your fork
```bash
git push fork feature/line-offset-adjustments
```

### 4. Create the Pull Request
1. Open your fork on GitHub.
2. Click **Compare & pull request**.
3. **Base repository:** `jlecomte/voice-activated-teleprompter` (`master`).
4. **Head repository:** `your-username/voice-activated-teleprompter` (`feature/line-offset-adjustments`).

### 5. Fill out the PR form
- **Suggested title:** `Harden speech recognition restart loop`
- **Suggested description:**
  - Summarize the fallback to `SpeechRecognition`/`webkitSpeechRecognition` and the restart guard.
  - Add verification steps (`npm run type-check` and manual teleprompter test with the long script).
  - Note the new logging and behavior when the API is unavailable or permission is denied.

## 🔥 Summary of changes

### ✅ Enhancements
- [x] Fallback to the standard or prefixed Web Speech API constructor
- [x] Timed restart when the recognition session ends unexpectedly
- [x] Logging and handling for permission errors
- [x] Safe bail-out when the API is missing

### 📁 Files touched
- `src/lib/speech-recognizer.ts` – constructor resolution, restart timer, logging
- `src/app/thunks.ts` – graceful failure when initialization throws
- `PR_INSTRUCTIONS.md` – this document

### 🧪 Tests performed
- ✅ `npm run type-check`
- ✅ Manual browser test reading a long passage

## 💡 Why this PR should be merged

1. **Reliability boost** – reduces voice scrolling stalls over long sessions.
2. **Backward compatible** – works in browsers with either speech API variant.
3. **Better diagnostics** – console logs explain restart attempts and failures.
4. **Low risk** – no UI changes and no new dependencies.
5. **Easy rollback** – scope is limited to the speech-recognition wrapper.

## 📧 After opening the PR
1. Monitor maintainer feedback.
2. Respond quickly to review comments.
3. Push follow-up commits if requested.
4. Await approval and merge.

---

**Useful references**
- This file – the submission checklist.
- `git show HEAD` – copy the latest diff summary into the PR if desired.
