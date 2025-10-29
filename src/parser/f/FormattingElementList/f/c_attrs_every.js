export default (
    (neAttrsMap) => (
        (a) => (
            neAttrsMap
            .get(a.name) === (a.value)
        )
    )
)