/**
 * TypeScript 枚举定义文件
 * 包含项目中使用的各种枚举类型
 */

// 编辑器相关枚举 
// 模版节点类型
export enum TemplateNodeType {
  HEADER = 'header',
  IMAGE_CARD = 'imageCard',
  WECHAT_STYLE = 'weChatStyle'  // 新增微信风格类型
}










// 导出所有枚举的联合类型（可选）
export type AllEnums = 
  | TemplateNodeType

// 枚举工具函数
export class EnumUtils {
  /**
   * 获取枚举的所有值
   */
  static getValues<T extends Record<string, string | number>>(enumObject: T): Array<T[keyof T]> {
    return Object.values(enumObject) as Array<T[keyof T]>;
  }

  /**
   * 获取枚举的所有键
   */
  static getKeys<T extends Record<string, string | number>>(enumObject: T): Array<keyof T> {
    return Object.keys(enumObject) as Array<keyof T>;
  }

  /**
   * 检查值是否在枚举中
   */
  static isValidValue<T extends Record<string, string | number>>(
    enumObject: T,
    value: any
  ): value is T[keyof T] {
    return Object.values(enumObject).includes(value);
  }

  /**
   * 将枚举转换为选项数组（用于下拉框等）
   */
  static toOptions<T extends Record<string, string | number>>(
    enumObject: T,
    labelMap?: Partial<Record<keyof T, string>>
  ): Array<{ value: T[keyof T]; label: string }> {
    return Object.entries(enumObject).map(([key, value]) => ({
      value: value as T[keyof T],
      label: labelMap?.[key as keyof T] || key
    }));
  }
}