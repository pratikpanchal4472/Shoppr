import { ClassConstructor, classToPlain, plainToClass } from "class-transformer";

export class Mapper {
  public static toModel<T>(type: ClassConstructor<T>, apiData: Object): T {
    return plainToClass(type, apiData);
  }

  public static toModelList<T>(type: ClassConstructor<T>, apiData: any): T[] {
    return plainToClass<T, T[]>(type, apiData);
  }

  public static toApi<T>(model: T): any {
    return classToPlain(model);
  }

  public static clone(model: any): any {
    return JSON.parse(JSON.stringify(model));
  }

  public static cloneModel<T>(type: ClassConstructor<T>, model: T): any {
    const deepCloned = this.clone(this.toApi(model));
    return this.toModel<T>(type, deepCloned);
  }

  public static cloneModelArray<T>(type: ClassConstructor<T>, models: T[]): any {
    const deepCloned = this.clone(this.toApi(models));
    return this.toModelList<T>(type, deepCloned);
  }
}
