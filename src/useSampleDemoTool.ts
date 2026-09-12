import { useEffect, useRef } from 'react'

type DemoTool = {
  name: string
  title: string
  description: string
  inputSchema: object
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }
  execute: (input: unknown) => Promise<object>
}
type ModelContext = { registerTool: (tool: DemoTool, options: { signal: AbortSignal }) => void | Promise<void> }

// API trình duyệt tùy chọn; chỉ mở demo hiện có, không gửi dữ liệu hay tạo yêu cầu thuê.
export function useSampleDemoTool(start: (need?: string) => void) {
  const action = useRef(start)
  action.current = start
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext
    if (!context?.registerTool) return
    const lifecycle = new AbortController()
    const tool: DemoTool = {
      name: 'start_sample_request',
      title: 'Mở yêu cầu video minh họa',
      description: 'Mở bước 1 của demo Quán Mộc và chọn nhu cầu minh họa. Chỉ thay đổi giao diện local; không tạo giao dịch hoặc gửi dữ liệu.',
      inputSchema: { type: 'object', properties: { need: { type: 'string', enum: ['product', 'story', 'review'] } }, required: ['need'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (!input || typeof input !== 'object' || !('need' in input) || !['product', 'story', 'review'].includes(String(input.need)) || Object.keys(input).some(key => key !== 'need')) throw new Error('Nhu cầu minh họa không hợp lệ.')
        action.current(String(input.need))
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
        return { mode: 'concept', step: 1, need: input.need, transmitted: false }
      },
    }
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}) } catch { /* Trình duyệt không hỗ trợ: dùng thao tác trực tiếp. */ }
    return () => lifecycle.abort()
  }, [])
}
