export interface SystemDTO {
  created_at: Date | string | number;
  updated_at?: Date | string | number;
}

export default class System {
  static convertIn(data: any) {
    return {
      ...data,
      created_at: new Date(),
    };
  }
}
