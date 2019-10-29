let fs = require('fs');

const getPixels = require("get-pixels");

function chunks(arr, size) {
    let output = [];
    for (let i = 0; i < arr.length; i += size) {
        output.push(arr.slice(i, i + size));
    }
    return output;
}

function transpose(matrix) {
    const rows = matrix.length, cols = matrix[0].length;
    const grid = [];
    for (let j = 0; j < cols; j++) {
        grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[j][i] = matrix[i][j];
        }
    }
    return grid;
}

getPixels("Stego.png", function (err, pixels) {
    if (err) {
        console.log("Bad image path")
        return
    }
    let redValues = pixels
        .data
        .filter((v, i) => i % 4 === 0)

        .map(i => i.toString(2).substr(-1));

    let leftTop_left = redValues.slice(0, 72)

    let leftTop_down = transpose(
            chunks(redValues,pixels.shape[0])
        ).flat().slice(0, 72)

    let leftBottom_left = redValues.slice((pixels.shape[0]*(pixels.shape[1]-1)), (pixels.shape[0]*(pixels.shape[1]-1))+72)

    let leftBottom_up = redValues.filter((v,i)=>i%pixels.shape[0]===0).reverse()


    let rightTop_right = redValues.slice(0, pixels.shape[0]).reverse()

    let rightTop_down = transpose(
            chunks(redValues,pixels.shape[0])
        ).flat().slice((pixels.shape[1]*(pixels.shape[0]-1)), (pixels.shape[1]*(pixels.shape[0]-1))+72)

    let rightBottom_right = redValues.reverse().slice(0, 72);

    let rightBottom_up =
        transpose(
            chunks(redValues,pixels.shape[0])
        ).flat().slice(0, 72);

    let sets = [leftTop_left,
        leftTop_down,
        leftBottom_left,
        leftBottom_up,
        rightTop_right,
        rightTop_down,
        rightBottom_right,
        rightBottom_up]
    for(let set of sets){
        let bits = chunks(set, 7)
            .map(i => i.join(""));

        let digits  = bits.map(i => parseInt(i, 2));
        let chars = digits.map(i => String.fromCharCode(i));
        console.log(chars.join(""));
    }
    // let redSignBit = redValues.map(i => i.toString(2).substr(-1));
    //
    // let bits = chunks(redSignBit, 8)
    //     .map(i => i.join(""));
    //
    // let digits  = bits.map(i => parseInt(i, 2));
    // let chars = digits.map(i => String.fromCharCode(i));

    // let redValues = transpose(
    //     chunks(pixels
    //             .data
    //             .filter((v, i) => i % 4 === 0),
    //         pixels.shape[0]
    //     )
    // ).flat()
    //     .map(i => i.toString(2).substr(-1));
    //
    //
    // let bits = chunks(redValues, 8)
    //     .map(i => i.join(""))
    //     .map(i => parseInt(i, 2))
    //     .map(i => String.fromCharCode(i));

    console.log("got pixels", pixels.shape.slice())
})