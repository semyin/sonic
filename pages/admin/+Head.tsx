export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var savedMode = localStorage.getItem('chakra-ui-color-mode');
                var systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var mode = savedMode || systemMode;
                
                if (mode === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            })()
          `,
        }}
      />{/* 其他 head 内容 */}
    </>
  )
}
