export class News {
  constructor(
    public id?: number,
    public user?: string,
    public title?: string,
    public content?: string,
    public source_url: string = 'http://',
  ) {}
}