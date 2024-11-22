document.addEventListener('DOMContentLoaded', () => {
    const transactionName = document.querySelector('#transaction-name')
    const transactionAmount = document.querySelector('#transaction-amount')
    const totalCashInPara = document.querySelector('#total-cash-in')
    const totalCashOutPara = document.querySelector('#total-cash-out')
    const totalNetBalancePara = document.querySelector('#total-net-balance')
    const submitBtn = document.querySelector('.submit-box')
    const transactionList = document.querySelector('.transaction-list')

    let transactions = JSON.parse(localStorage.getItem('transactions')) || []
    let totalCashIn = 0
    let totalCashOut = 0
    let totalNetAmount = 0

    updateTransaction()

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()

        let nameValue = transactionName.value.trim()
        let amountValue = Number(transactionAmount.value)

        if(nameValue == '' || isNaN(amountValue)){
            return
        }

        let newTransaction
        if(e.target.id === 'cash-in'){

            newTransaction = {
                id: Date.now(),
                name: nameValue,
                amount: amountValue,
                balance: 0
            }

        }else{

            newTransaction = {
                id: Date.now(),
                name: nameValue,
                amount: -amountValue,
                balance: 0
            }

        }

        transactions.push(newTransaction)
        updateTransaction()

        transactionName.value = ''
        transactionAmount.value = ''
    })


    transactionList.addEventListener('click', (e) => removeTransaction(e))


    function updateTransaction(){
        let updatedBalanceTransactions = []

        let totalbalance = transactions.reduce(reducer, {
            amount: 0,
        })

        transactions = updatedBalanceTransactions

        let totalIncoming = transactions.reduce((acc, curr) => curr.amount >= 1 ? curr.amount + acc : acc, 0)
        let totalExpense = transactions.reduce((acc, curr) => curr.amount < 1 ? curr.amount + acc : acc, 0)

        totalCashIn = totalIncoming
        totalCashOut = totalExpense
        totalNetAmount = totalbalance.amount

        saveToLocal()
        showTransactions()

        function reducer(acc, curr){
            const returns = acc.amount + curr.amount
            const currTransaction = {
                ...curr,
                balance: returns
            }
            updatedBalanceTransactions.push(currTransaction)
            return {
                amount: returns
            }
        }
    }


    function showTransactions(){
        totalCashInPara.textContent = totalCashIn.toFixed(2)
        totalCashOutPara.textContent = totalCashOut.toFixed(2)
        totalNetBalancePara.textContent = totalNetAmount.toFixed(2)


        transactionList.innerHTML = ''
        transactions.forEach(transaction => {
            let transactionCount = transactionList.childElementCount + 1
            const li = document.createElement('li')
            li.classList.add('transaction-view')

            li.innerHTML = `
                <p>${transactionCount}</p>
                <p>${transaction.name}</p>
                <p class='${transaction.amount > 0 ? 'text-green' : 'text-red'}'>${transaction.amount > 0 ? '+' + transaction.amount.toFixed(2) : transaction.amount.toFixed(2)}</p>
                <p style='color:blue'>${transaction.balance.toFixed(2)}</p>
                <div>
                    <button data-id='${transaction.id}'>Delete</button>
                </div>
            `

            transactionList.prepend(li)
        })
    }

    function saveToLocal(){
        localStorage.setItem('transactions', JSON.stringify(transactions))
    }

    function removeTransaction(e){

        if(e.target.tagName === 'BUTTON'){
            let transactId = parseInt(e.target.dataset.id)

            transactions = transactions.filter(transact => transact.id !== transactId)

            updateTransaction()
        }
    }



})
