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
    console.log('hello', event);

    this.updatePdfDocument(event);
  }

  updatePdfDocument(event: DocumentEvent) {
    // event.includeBorders = true;
    const mmToPtRatio = 2.83466667;
    // const mmToPtRatio = 2.8346456692913384;
    const marginSize = 9 * mmToPtRatio;

    const columns = 12;
    const rows = 28;

    const pageWidth = 595.28;
    const contentWidth = pageWidth - 2 * marginSize;
    const columnWidth = 16 * mmToPtRatio - 0.5 - 0.5 / columns;

    const topRowHeight = 3 * mmToPtRatio;
    const bottomRowHeight = 7 * mmToPtRatio;

    const tableBuilder = new TableBuilder(columns, rows);

    for (const item of event.items) {
      tableBuilder.addCell({
        table: {
          heights: [topRowHeight + bottomRowHeight],
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

      for (let index = 0; index < item.amount; index++) {
        const itemPrice = item.price + ' zł';
        const itemDiscount = -item.discount + '%';
        const itemDiscountPrice = this.calculatePriceAfterDiscount(item.price, item.discount) + ' zł';

        const topRowFontSize = 5;
        const bottomRowFontSize = 9;

        tableBuilder.addCell({
          table: {
            heights: [topRowHeight, bottomRowHeight],
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: itemPrice,
                  fontSize: topRowFontSize,
                  decoration: 'lineThrough',
                  // fillColor: 'red',
                  alignment: 'center',
                  noWrap: true,
                  margin: [0, 1, 0, 0]
                },
                {
                  text: itemDiscount,
                  fontSize: topRowFontSize,
                  // fillColor: 'green',
                  alignment: 'center',
                  noWrap: true,
                  margin: [0, 1, 0, 0]
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
                  margin: [0, 4, 0, -4]
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
    }

    const widths = [];

    for (let i = 0; i < columns; i++) {
      widths.push(columnWidth);
    }

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: marginSize,
      defaultStyle: {
        margin: 0
      },
      content: [{
        // fillColor: 'yellow',
        table: {
          heights: topRowHeight + bottomRowHeight - 0.5 - 0.5 / rows,
          widths,
          body: tableBuilder.buildTable(),
          margin: 0
        },
        layout: {
          hLineWidth(i, node) {
            console.log(i, node);
            return event.includeBorders ? 0.5 : 0;
          },
          vLineWidth(i, node) {
            return event.includeBorders ? 0.5 : 0;
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
      }]
    };

    // console.log(docDefinition);

    pdfMake.createPdf(docDefinition).getDataUrl((outDoc) => {
      // document.getElementById('pdfV')[0].src = outDoc;
      // console.log("setting", outDoc);
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
