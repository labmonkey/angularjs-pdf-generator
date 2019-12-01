import {Component, OnInit} from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

import {DataService} from '../data.service';
import {DocumentEvent} from '../document-event';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-container',
  templateUrl: './pdf-container.component.html',
  styleUrls: ['./pdf-container.component.scss']
})
export class PdfContainerComponent implements OnInit {

  pdfUrl: string;

  // A4: [210, 297]
  // A4: [595.28, 841.89]

  // 1mm = 2,8px
  // 16mm x 10mm

  // 12 x 29

  constructor(private dataService: DataService) {
    this.pdfUrl = 'about:blank';
  }

  ngOnInit() {
    this.dataService.currentEvent.subscribe(event => this.onDocumentFormChange(event));
  }

  onDocumentFormChange(event: DocumentEvent) {
    this.updatePdfDocument(event);
  }

  updatePdfDocument(event: DocumentEvent) {
    // event.includeBorders = true;
    const mmToPtRatio = 2.83466667;
    // const mmToPtRatio = 2.8346456692913384;
    const marginSize = 9 * mmToPtRatio;

    const columns = 12;
    const rows = 28;
    const cells = columns * rows;

    const pageWidth = 595.276;
    const pageHeight = 841.89;
    const borderWidth = 0.567;

    // 70.866 , 116.22
    // 45,315

    const contentWidth = pageWidth - 2 * marginSize;
    // const columnWidth = 16 * mmToPtRatio - 0.5 - 0.5 / columns;
    const columnWidth = 45.3543333333;

    const columnHeight = 28.3464642857;

    // const topRowHeight = 3 * mmToPtRatio;
    // const bottomRowHeight = 7 * mmToPtRatio;

    const topRowHeight = 0.3 * columnHeight;
    const bottomRowHeight = 0.7 * columnHeight;

    let tableBuilder;

    const columnWidths = [];

    for (let i = 0; i < columns; i++) {
      columnWidths.push(columnWidth - (event.includeBorders ? borderWidth : 0));
    }

    const pageContent = [];

    tableBuilder = new TableBuilder(columns, rows);
    let totalAmount = 0;
    let currentAmount = 0;

    for (const item of event.items) {
      totalAmount += +item.amount + (item.name !== null && item.name !== '' ? 1 : 0);
    }

    for (const item of event.items) {
      if (item.name !== null && item.name !== '') {
        tableBuilder.addCell({
          table: {
            heights: topRowHeight + bottomRowHeight - (event.includeBorders ? borderWidth + borderWidth / rows : 0),
            widths: [columnWidth],
            body: [
              [
                {
                  text: item.name,
                  fontSize: 8,
                  alignment: 'center',
                  noWrap: true,
                  margin: 0
                }
              ]
            ]
          },
          layout: {
            hLineWidth(i, node) {
              return 0;
            },
            vLineWidth(i, node) {
              return 0;
            },
            paddingLeft(i, node) {
              return 0;
            },
            paddingRight(i, node) {
              return 0;
            },
            paddingTop(i, node) {
              return 0;
            },
            paddingBottom(i, node) {
              return 0;
            }
          }
        });
        currentAmount++;

        if (currentAmount % cells === 0 || currentAmount === totalAmount) {
          if (currentAmount !== 0) {
            console.log('creating TableBuilder');
            pageContent.push({
              // fillColor: 'yellow',
              table: {
                heights: topRowHeight + bottomRowHeight - (event.includeBorders ? borderWidth + borderWidth / rows : 0),
                widths: columnWidths,
                body: tableBuilder.buildTable(),
                margin: 0
              },
              pageBreak: pageContent.length === 0 ? null : 'before',
              layout: {
                hLineWidth(i, node) {
                  return event.includeBorders ? borderWidth : 0;
                },
                vLineWidth(i, node) {
                  return event.includeBorders ? borderWidth : 0;
                },
                paddingLeft(i, node) {
                  return 0;
                },
                paddingRight(i, node) {
                  return 0;
                },
                paddingTop(i, node) {
                  return 0;
                },
                paddingBottom(i, node) {
                  return 0;
                },
              }
            });

            tableBuilder = new TableBuilder(columns, rows);
          }
        }
      }

      for (let index = 0; index < item.amount; index++) {
        const itemPrice = item.price + ' zł';
        const itemDiscount = -item.discount + '%';
        const itemDiscountPrice = this.calculatePriceAfterDiscount(item.price, item.discount) + ' zł';

        const topRowFontSize = 6;
        const bottomRowFontSize = 9;

        console.log(item.discount);

        if (item.discount === '0' || item.discount === 0 || item.discount == null) {
          tableBuilder.addCell({
            table: {
              heights: [(topRowHeight + bottomRowHeight) - (event.includeBorders ? borderWidth + borderWidth / rows : 0) / 2],
              widths: ['auto'],
              body: [
                [
                  {
                    text: itemDiscountPrice,
                    fontSize: bottomRowFontSize,
                    bold: true,
                    // fillColor: 'blue',
                    alignment: 'center',
                    noWrap: true,
                    margin: [-1, 9, 0, 0]
                  }
                ]
              ]
            },
            layout: {
              hLineWidth(i, node) {
                return 0;
              },
              vLineWidth(i, node) {
                return 0;
              },
              paddingLeft(i, node) {
                return 0;
              },
              paddingRight(i, node) {
                return 0;
              },
              paddingTop(i, node) {
                return 0;
              },
              paddingBottom(i, node) {
                return 0;
              }
            }
          });
        } else {
          tableBuilder.addCell({
            table: {
              heights: [topRowHeight - (event.includeBorders ? borderWidth + borderWidth / rows : 0) / 2, bottomRowHeight - (event.includeBorders ? borderWidth + borderWidth / rows : 0) / 2],
              widths: ['*', 'auto'],
              body: [
                [
                  {
                    text: itemPrice,
                    fontSize: topRowFontSize,
                    decoration: 'lineThrough',
                    // fillColor: 'red',
                    alignment: 'left',
                    noWrap: true,
                    margin: [1, 2, 0, -10]
                  },
                  {
                    text: itemDiscount,
                    fontSize: topRowFontSize,
                    // fillColor: 'green',
                    alignment: 'right',
                    noWrap: true,
                    margin: [0, 2, 1, -10]
                  }
                ],
                [
                  {
                    text: itemDiscountPrice,
                    colSpan: 2,
                    fontSize: bottomRowFontSize,
                    bold: true,
                    // fillColor: 'blue',
                    alignment: 'center',
                    noWrap: true,
                    margin: [-1, 4, 0, -10]
                  },
                  {}
                ]
              ]
            },
            layout: {
              hLineWidth(i, node) {
                return 0;
              },
              vLineWidth(i, node) {
                return 0;
              },
              paddingLeft(i, node) {
                return 0;
              },
              paddingRight(i, node) {
                return 0;
              },
              paddingTop(i, node) {
                return 0;
              },
              paddingBottom(i, node) {
                return 0;
              }
            }
          });
        }
        currentAmount++;

        if (currentAmount % cells === 0 || currentAmount === totalAmount) {
          if (currentAmount !== 0) {
            console.log('creating TableBuilder');
            pageContent.push({
              // fillColor: 'yellow',
              table: {
                heights: topRowHeight + bottomRowHeight - (event.includeBorders ? borderWidth + borderWidth / rows : 0),
                widths: columnWidths,
                body: tableBuilder.buildTable(),
                margin: 0
              },
              pageBreak: pageContent.length === 0 ? null : 'before',
              layout: {
                hLineWidth(i, node) {
                  return event.includeBorders ? borderWidth : 0;
                },
                vLineWidth(i, node) {
                  return event.includeBorders ? borderWidth : 0;
                },
                paddingLeft(i, node) {
                  return 0;
                },
                paddingRight(i, node) {
                  return 0;
                },
                paddingTop(i, node) {
                  return 0;
                },
                paddingBottom(i, node) {
                  return 0;
                },
              }
            });

            tableBuilder = new TableBuilder(columns, rows);
          }
        }
      }
    }

    const docDefinition = {
      pageSize: {width: pageWidth, height: pageHeight},
      // pageMargins: [25.551, 24.094, 25.513, 24.094],
      pageMargins: [24.094, 24.094, 24.094, 24.094],
      defaultStyle: {
        margin: 0
      },
      content: pageContent
    };

    pdfMake.createPdf(docDefinition).getDataUrl((outDoc) => {
      this.pdfUrl = outDoc;
    });
  }

  calculatePriceAfterDiscount(price: number, discount: number) {
    return (price - (price * discount / 100)).toFixed(2);
  }

  calculateFontSize(text: string, baseSize: number) {
    if (text.length > 8) {
      return baseSize - 1;
    }
    return baseSize;
  }
}

class TableBuilder {
  content;
  cells;

  columns: number;
  rows: number;

  constructor(columns: number, rows: number) {
    this.cells = [];
    this.columns = columns;
    this.rows = rows;
    this.content = new Array(rows).fill({}).map(() => Array(columns).fill({}));
  }

  addCell(cell) {
    this.cells.push(cell);
  }

  buildTable() {
    let colIndex = 0;
    let rowIndex = 0;
    for (const cell of this.cells) {
      this.content[rowIndex][colIndex] = cell;
      // this.content[rowIndex][colIndex] = rowIndex + ':' + colIndex;

      colIndex++;
      if (colIndex >= this.columns) {
        colIndex = 0;
        rowIndex++;
      }
    }

    return this.content;
  }
}
