import { format } from "date-fns";
import type { MiddlewareHandler } from "hono";

// 控制台颜色代码
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

// 格式化当前时间的辅助函数
const formatTime = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

// 创建带时间戳和颜色的日志记录器
const createLogger = (requestStartTime: Date) => {
  const baseTimestamp = `${colors.dim}[${formatTime(requestStartTime)}]${colors.reset}`;
  
  return {
    info: (emoji: string, message: string) => {
      console.log(`${baseTimestamp} ${emoji} ${colors.cyan}${message}${colors.reset}`);
    },
    success: (emoji: string, message: string) => {
      console.log(`${baseTimestamp} ${emoji} ${colors.green}${message}${colors.reset}`);
    },
    warn: (emoji: string, message: string) => {
      console.log(`${baseTimestamp} ${emoji} ${colors.yellow}${message}${colors.reset}`);
    },
    error: (emoji: string, message: string) => {
      console.log(`${baseTimestamp} ${emoji} ${colors.red}${message}${colors.reset}`);
    },
    data: (emoji: string, label: string, data: any) => {
      console.log(`${baseTimestamp} ${emoji} ${colors.green}${label}:${colors.reset}`);
      if (typeof data === 'string') {
        console.log(data);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    },
    divider: () => {
      console.log(`${colors.dim}──────────────────────────────────────────────────────${colors.reset}`);
    }
  };
};

// 自定义详细日志中间件
const detailedLogger: MiddlewareHandler = async (c, next) => {
  // 1. 创建一个单一的时间对象和记录器
  const requestStartTime = new Date();
  const startTimeMs = performance.now();
  const log = createLogger(requestStartTime);
  
  const requestUrl = c.req.url;
  const method = c.req.method;
  
  log.info('👉', `${colors.bright}${method}${colors.reset} ${requestUrl}`);
  
  // 2. 尝试获取并记录请求体
  let requestBody = null;
  try {
    const contentType = c.req.header('content-type');
    
    // 克隆请求以避免流被消费
    const clonedReq = c.req.raw.clone();
    
    if (contentType?.includes('application/json')) {
      try {
        requestBody = await clonedReq.json();
        log.data('📦', 'Request Body', requestBody);
      } catch (e) {
        log.warn('📦', 'Request Body: Unable to parse JSON body');
      }
    } else if (contentType?.includes('application/x-www-form-urlencoded') || contentType?.includes('multipart/form-data')) {
      try {
        const formData = await clonedReq.formData();
        // 使用手动转换方法，避免使用 entries()
        const formDataObj: Record<string, string | File> = {};
        
        // 使用 FormData 的 forEach 方法
        formData.forEach((value, key) => {
          if (value instanceof File) {
            formDataObj[key] = `[File: ${value.name}, ${value.size} bytes]`;
          } else {
            formDataObj[key] = value;
          }
        });
        
        requestBody = formDataObj;
        log.data('📦', 'Request Body', requestBody);
      } catch (e) {
        log.warn('📦', `Request Body: Unable to parse form data: ${e}`);
      }
    } else if (method === 'GET' || method === 'HEAD') {
      const query = c.req.query();
      if (Object.keys(query).length) {
        log.data('📦', 'Query params', query);
      } else {
        log.info('📦', 'No query params');
      }
    } else {
      try {
        const textBody = await clonedReq.text();
        if (textBody) {
          const displayText = textBody.length > 1000 
            ? textBody.substring(0, 1000) + '...(truncated)' 
            : textBody;
          log.data('📦', 'Request Body (text)', displayText);
        } else {
          log.info('📦', 'No request body');
        }
      } catch (e) {
        log.warn('📦', 'Unable to read request body');
      }
    }
  } catch (e) {
    log.error('📦', `Error reading request body: ${e}`);
  }
  
  // 3. 执行下一个中间件
  await next();
  
  // 4. 计算耗时
  const endTimeMs = performance.now();
  const duration = endTimeMs - startTimeMs;
  
  // 5. 尝试获取响应内容
  let responseBody: string | null = null;
  
  // 响应状态颜色
  const getStatusColor = (status: number) => {
    if (status < 300) return colors.green;
    if (status < 400) return colors.cyan;
    if (status < 500) return colors.yellow;
    return colors.red;
  };
  
  const statusColor = getStatusColor(c.res.status);
  
  if (c.res && c.res.body) {
    try {
      // 克隆响应以避免流被消费
      const clonedRes = c.res.clone();
      const contentType = c.res.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          const jsonBody = await clonedRes.json();
          log.data('🔄', 'Response Body', jsonBody);
        } catch (e) {
          log.warn('🔄', 'Invalid JSON response');
        }
      } else if (contentType?.includes('text/')) {
        try {
          const textBody = await clonedRes.text();
          const displayText = textBody.length > 1000 
            ? textBody.substring(0, 1000) + '...(truncated)' 
            : textBody;
          log.data('🔄', 'Response Body', displayText);
        } catch (e) {
          log.warn('🔄', 'Error reading text response');
        }
      } else {
        log.info('🔄', `Binary content: ${contentType}`);
      }
    } catch (e) {
      log.error('🔄', `Error reading response: ${e}`);
    }
  } else {
    log.info('🔄', 'No response body or unable to read response');
  }
  
  // 6. 打印完整的日志信息
  log.success('✅', `Response for ${method} ${requestUrl}`);
  log.info('⏱️', `Duration: ${colors.yellow}${duration.toFixed(2)}ms${colors.reset}`);
  log.info('🔢', `Status: ${statusColor}${c.res.status}${colors.reset}`);
  
  log.divider();

  return c.res;
}

export { detailedLogger };