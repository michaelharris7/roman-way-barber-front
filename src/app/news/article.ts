export class Article {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public ref_source_url: string = 'http://',
  ) {}
}