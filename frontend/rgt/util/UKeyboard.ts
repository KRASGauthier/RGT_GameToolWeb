export function keyboartdIsSubmit(event: Pick<KeyboardEvent, "key" | "code">): boolean {
	return event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter";
}
