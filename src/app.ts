// singleton class

class Singleton {
    private static instance: Singleton;

    private constructor(public name: string) {

    }

    static getInstance() {
        if (Singleton.instance) return this.instance;

        this.instance = new Singleton('my special singletone');
        return this.instance;
    }
}

const SingletoneOne = Singleton.getInstance();
const SingletoneTwo = Singleton.getInstance();
// const SingletoneThree = new Singleton;



console.log(SingletoneOne);
console.log(SingletoneTwo);
