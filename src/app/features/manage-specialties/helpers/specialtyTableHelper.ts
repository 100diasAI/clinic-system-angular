export class SpecialtyTableHelper {
  private _baseColumnTitles: { [key: string]: string } = {};
  private _baseColumnNames: string[] = [];
  private _allColumnNames: string[] = [];

  get baseColumnTitles(): { [key: string]: string } {
    return this._baseColumnTitles;
  }

  get baseColumnNames(): string[] {
    return this._baseColumnNames;
  }

  get allColumnNames(): string[] {
    return this._allColumnNames;
  }

  setColumnConfiguration(
    columnNames: string[],
    columnTitles: { [key: string]: string }
  ) {
    this._baseColumnNames = columnNames;
    this._baseColumnTitles = columnTitles;
    this._allColumnNames = columnNames;
  }

  setAllColumnNames(additionalColumns: string[]): void {
    this._allColumnNames = [...this._baseColumnNames, ...additionalColumns];
  }
}
