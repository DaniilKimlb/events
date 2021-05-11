export function toFormData(formObj) {
    let formData = new FormData()
    Object.keys(formObj).forEach((e) => {
        if (formObj[e]) {
            formData.append(e, formObj[e])
        }
    })
    return formData
}
