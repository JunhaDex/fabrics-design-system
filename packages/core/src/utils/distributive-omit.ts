/**
 * 유니온의 각 갈래에 Omit 을 따로 적용한다.
 * 일반 Omit 은 유니온을 하나로 뭉개 판별(discriminant)이 사라진다 —
 * Radix 의 `type` 으로 갈리는 props(ToggleGroup, Accordion)가 그 경우다.
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
