export default function Pipe({ height, left, gap, gameHeight, gameWidth }) {
    const pipeWidth = 60; // You can make this dynamic if you want
    return (
        <>
            <div
                className="absolute bg-green-600"
                style={{ width: `${pipeWidth}px`, height: `${height}px`, left: `${left}px`, top: 0 }}
            />
            <div
                className="absolute bg-green-600"
                style={{
                    width: `${pipeWidth}px`,
                    height: `${gameHeight - height - gap}px`,
                    top: `${height + gap}px`,
                    left: `${left}px`,
                }}
            />
        </>
    );
}