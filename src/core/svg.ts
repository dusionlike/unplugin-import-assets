export function transformSvgToReactComponent(code: string): string {
  // 添加props
  code = code.replace(/<svg/g, '<svg {...props}')

  const componentCode = `import * as React from 'react'

  const SvgComponent = (props) => (
    ${code}
  )
  
  export default SvgComponent`

  return componentCode
}
