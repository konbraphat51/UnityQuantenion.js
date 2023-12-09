const Quaternion = require('./Quaternion.js')

test("constructor", () => {
    const q = new Quaternion(1, 2, 3, 4)
    expect(q.x).toBe(1)
    expect(q.y).toBe(2)
    expect(q.z).toBe(3)
    expect(q.w).toBe(4)
})
