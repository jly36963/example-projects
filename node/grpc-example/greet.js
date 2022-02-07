export function greet(call) {
  const personNameList = call?.request?.personNameList || []

  personNameList.forEach(n => {
    console.log(`Hey there, ${n}`)
  })

  call.write({
    message: `Greeted ${personNameList.length} people.`
  })
  call.end()
}