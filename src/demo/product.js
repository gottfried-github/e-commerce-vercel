import './product.html'
import './product.css'
import {ObjectId} from 'bson'

function send(data) {
    return fetch('/api/admin/product/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

function successCreate(res) {
    return fetch(`/api/admin/product/${res.body}`, {method: 'GET'})
    .then(res => {
        return res.json().then((body) => {
            return {res, body}
        })
    }).then(res => {
        console.log("parsed body of response to GET request:", res.body);
        return (res.res.ok) ? successRead(res) : failureRead(res)
    })
}

function failureCreate(res) {
    console.log("something went wrong creating the product", res);
}

function successRead(res) {
    console.log("got the written product:", res.body)
}

function failureRead(res) {
    console.log("something went wrong getting the written product:", res);
}

function main() {
    const data = {
        name: "Samsung Galaxy A11",
        itemInitial: new ObjectId().toString(),
        isInSale: true
    }

    console.log("data to send", data)
    send(data).then(res => {
        console.log('response:', res)

        return res.json().then((body) => {
            return {res, body}
        })
    }).then((res) => {
        console.log('parsed response body', res.body)

        return (res.res.ok) ? successCreate(res) : failureCreate(res)
    })
}

document.addEventListener('DOMContentLoaded', main)