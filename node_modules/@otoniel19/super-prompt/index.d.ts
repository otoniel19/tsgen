export = SuperPrompt;
declare class SuperPrompt {
    /**
     * @param {String} historyFile the file to save the history
     */
    constructor(historyFile: string, opts?: {
        close: boolean;
        persist: boolean;
    });
    historyFile: string;
    opts: {
        close: boolean;
        persist: boolean;
    };
    on(event: any, cb: any): void;
    /**
     * @param {String} name the question name to ask
     * ```js
     * var prompt = new SuperPrompt("./myhistory",{ close: true })
     * prompt.ask("enter name",(questionData) => console.log(`hi ${questionData}`))
     * ```
     * @param {Function} fn the callback function to read the asked data
     */
    ask(name: string, fn: Function): void;
    /**
     * the SuperPrompt readline
     * @returns {typeof readline}
     */
    get readline(): any;
    /**
     * the SuperPrompt interface
     * @returns {typeof prompter}
     */
    get interface(): any;
}
