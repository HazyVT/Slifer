class Math {
    public lerp(start: number, stop: number, step: number) : number {
        return (1 - step) * start + step * stop;
    }
}

export default Math;