declare global {
    namespace NodeJS {
        interface Global {
            danger: any;
            warn: any;
        }
    }
}
export {};
