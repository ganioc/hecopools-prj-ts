import { BigNumber } from "bignumber.js";

interface IfValuePair {
    x: BigNumber;
    y: BigNumber;
}

/**
 * 
 * @param a0  input tokenA
 * @param b0  input tokenB
 * @param a1  reserve tokenA
 * @param b1  reserve tokenB
 * 
 * 
 * return { x: Val, y: 0 } or { x: 0, y: Val}
 * 
 */
function compute(bn_a0: BigNumber, bn_b0: BigNumber, bn_a1: BigNumber, bn_b1: BigNumber): IfValuePair {
    console.log('input a0:', bn_a0.toString(), " b0:", bn_b0.toString())
    console.log('input a1:', bn_a1.toString(), " b1:", bn_b1.toString())

    const ratio_0 = bn_a0.div(bn_b0);
    const ratio_1 = bn_a1.div(bn_b1);

    if (ratio_0.isEqualTo(ratio_1)) {
        console.log('\nequal')
        return compute_exact(bn_a0, bn_b0, bn_a1, bn_b1)
    } else if (ratio_0.isLessThan(ratio_1)) {
        console.log('\nless')
        return compute_short(bn_a0, bn_b0, bn_a1, bn_b1)
    } else {
        console.log('\nlarger')
        return compute_extra(bn_a0, bn_b0, bn_a1, bn_b1)
    }
}
function compute_exact(a0: BigNumber, b0: BigNumber, a1: BigNumber, b1: BigNumber): IfValuePair {
    return { x: new BigNumber(0), y: new BigNumber(0) }
}
function compute_extra(a0: BigNumber, b0: BigNumber, a1: BigNumber, b1: BigNumber): IfValuePair {

    console.log('compute_extra()')
    // console.log('a0',a0.toString())
    // console.log('b0',b0.toString())
    // console.log('a1',a1.toString())
    // console.log('b1',b1.toString())

    const coef_a = b1.div(a1).multipliedBy(new BigNumber(0.002));
    const coef_b = a0.div(a1)
        .plus(2)
        .multipliedBy(b1)
        .plus(b0.multipliedBy(new BigNumber(0.998)))
        .multipliedBy(-1)
    const coef_c = a0.multipliedBy(b1).minus(a1.multipliedBy(b0))

    // console.log('coefficents:')
    // console.log('a:', coef_a.toString())
    // console.log('b:', coef_b.toString())
    // console.log('c:', coef_c.toString())

    const delta = (coef_b.multipliedBy(coef_b)
        .minus(coef_a.multipliedBy(coef_c).multipliedBy(4))).sqrt();

    // console.log('delta:', delta.toString())

    if(delta.isLessThan(0)){
        throw new Error('No solution')
    }
    
    const x1 = (delta.minus(coef_b)).div(coef_a.multipliedBy(2))
    const x2 = (delta.multipliedBy(-1).minus(coef_b)).div(coef_a.multipliedBy(2))

    // console.log('x1:', x1.toString())
    // console.log('x2: ', x2.toString())

    let x_final;

    if(x1.gt(a0) && x2.lt(a0)){
        x_final = x2;
    }else if(x2.gt(a0) && x1.lt(a0)){
        x_final = x1;
    }else{
        throw new Error('x not exists')
    }

    return { x: x_final, y: new BigNumber(0) }

}
function compute_short(a: BigNumber, b: BigNumber, as: BigNumber, bs: BigNumber): IfValuePair {

    let result2 = compute_extra(b,a,bs,as);

    return { x: result2.y, y: result2.x }
}
function compute0(bn_a0: number, bn_b0: number, bn_a1: number, bn_b1: number): IfValuePair{
    return compute(new BigNumber(bn_a0) ,new BigNumber(bn_b0) ,new BigNumber(bn_a1) ,new BigNumber(bn_b1) )
}

// console.log('compute(1,2,10,20)',compute0(1,2,10,20))

console.log('\ncompute(2,2,1000,2000)')
let result = compute0(2,2,1000,2000)
console.log('x:', result.x.toString())
console.log('y:', result.y.toString())


console.log('\ncompute(2,2,2000,1000)')
result = compute0(2,2,2000,1000)
console.log('x:', result.x.toString())
console.log('y:', result.y.toString())
