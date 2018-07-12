/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    // d3
    import Selection = d3.Selection;

    // powerbi.extensibility.utils.interactivity
    import IInteractiveBehavior = powerbi.extensibility.utils.interactivity.IInteractiveBehavior;
    import SelectableDataPoint = powerbi.extensibility.utils.interactivity.SelectableDataPoint;
    import IInteractivityService = powerbi.extensibility.utils.interactivity.IInteractivityService;
    import ISelectionHandler = powerbi.extensibility.utils.interactivity.ISelectionHandler;

    export class TornadoWebBehavior implements IInteractiveBehavior {
        private columns: Selection<any>;
        private clearCatcher: Selection<any>;
        private interactivityService: IInteractivityService;

        public bindEvents(options: TornadoBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.columns = options.columns;
            this.clearCatcher = options.clearCatcher;
            this.interactivityService = options.interactivityService;

            this.columns.on("click", (d: SelectableDataPoint, i: number) => {
                selectionHandler.handleSelection(d, (d3.event as MouseEvent).ctrlKey);
            });

            this.clearCatcher.on("click", () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            let hasHighlights: boolean = this.interactivityService.hasSelection();
            this.changeOpacityAttribute("fill-opacity", hasSelection, hasHighlights);
            this.changeOpacityAttribute("stroke-opacity", hasSelection, hasHighlights);
        }

        private changeOpacityAttribute(attributeName: string, hasSelection: boolean, hasHighlights: boolean) {
            this.columns.style(attributeName, (d: TornadoChartPoint) => {
                return tornadoChartUtils.getOpacity(
                    d.selected,
                    d.highlight,
                    !d.highlight && hasSelection,
                    !d.selected && hasHighlights);
            });
        }
    }
}
