---
"@asheeui/cli": patch
---

The playgrounds a copied project receives no longer carry a testing library. The
contract helpers a section uses for the interactions it expects now take React's
own `act`, so the application's dependency graph reaches nothing that belongs to a
test, and a test walks that graph to keep it that way.
