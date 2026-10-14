---
'@junhadex/core': patch
'@junhadex/tokens': patch
'@junhadex/theme-neutral': patch
'@junhadex/theme-brutalism': patch
'@junhadex/theme-tactile-surface': patch
---

한 행에 놓이는 컨트롤의 높이를 맞췄다. 테두리 없는 Button 변형(primary·danger·ghost)과 Toggle 에 투명 테두리를 둬서 secondary Button·Input·Select 와 같은 높이가 된다. 이 컨트롤들은 2px 높아진다(sm 기준 neutral 36 → 38px). 강제 색상 모드에서는 투명 테두리가 보이므로 그림자로 그린 외곽선이 사라져도 경계가 남는다. 값과 placeholder 가 모두 없는 Select 가 아이콘 높이로 줄어들던 문제도 고쳤다.
