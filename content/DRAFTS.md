# Writing desk

These are substantive first drafts, prepared September 6, 2026 from public issues, PRs, and source. All have `draft: true`; they do not appear on the website. They are stored in this public GitHub repository, so draft does not mean confidential.

| Suggested order | File | Focus | Verified status |
| --- | --- | --- | --- |
| 1 | `posts/renode-wfe-missed-wakeup.md` | A firmware hang explained through interrupt ordering and event state | Maintainers reproduced the report and shipped their own fix/test; Ahnaf's PR was closed without merge |
| 2 | `posts/renode-thumb2-mov-sp.md` | Following a single instruction through a decoder and a failing/passing reproduction | Upstream PR #20 and issue #884 remain open as of September 6 |
| 3 | `posts/cubesolver-model-and-animation.md` | Packed state, partial goals, and making the renderer agree with the model | Based on merged public work through CubeSolver commit `67796f5` |

Each post includes source links and a work record. Author-review notes are HTML comments at the end. Review the first-person framing, add any real traces or photos you want, set the publication date, and change `draft` to `false` when ready.

## Keep this a living record

Keep a published filename stable: it determines the permanent URL. Append dated entries to its Work record when a patch lands, a hypothesis changes, or a new experiment supplies evidence. Correct explanations in place, and note substantive corrections in that record. Distinguish proposed experiments from results you actually collected.

The articles link to permanent commits for implementation details and issue/PR pages for ongoing discussion. The drafting date is not the date the original work happened. All content used in these drafts is public; private Simantic work was not included.

Potential follow-ups from other public repositories: LC-3 instruction decoding and measurement, or a trace through the CeePeeU pipeline. Research the actual implementation before turning those into claims; a README's wishlist is not evidence that a feature exists.
