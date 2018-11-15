import React from 'react'
import Board from './Board'

const dimensions = []
for (let i = 0; i < 20; i++) {
    let curRow = []
    for (let j = 0; j < 20; j++) {
        curRow.push(null)
    }
    dimensions.push(curRow)
}
console.log(dimensions)

class Main extends React.Component {
    render() {
        return (
            <Board />
        )
        // return (
        //     <table>
        //         <tbody>
        //             {dimensions.map((elem, idx) => {
        //                 return (
        //                 <tr key={idx}>
        //                     {elem.map((val, i) => {
        //                         if (val) {
        //                             return <td key={i} />
        //                         } else {
        //                             return <td key={i} />
        //                         }
        //                     })}
        //                 </tr>)
        //             })}
        //         </tbody>
        //     </table>
        // )
    }
}

export default Main