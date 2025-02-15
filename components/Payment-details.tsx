

const Paymentinfo= () => {
  return (<div>

  
    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Mpesa Payment Instructions</h2>
    <div className="space-y-6">
      <p className="font-bold text-xl text-gray-700">Lipa na Mpesa</p>

      <ol className="list-decimal pl-6 space-y-2 text-gray-700">
        <li className="text-lg">
          Go to Mpesa.
        </li>
        <li className="text-lg">
          Lipa na Mpesa.
        </li>
        <li className="text-lg">
          Enter paybill number <span className="font-semibold text-blue-600">522533</span>.
        </li>
        <li className="text-lg">
          Enter account number <span className="font-semibold text-blue-600">5939840</span>.
        </li>
        <li className="text-lg">
          Enter the amount.
        </li>
        <li className="text-lg">
          Enter your M-PESA PIN.
        </li>
        <li className="text-lg">
          Confirm that all details are correct and press OK.
        </li>
        <li className="text-lg">
          You will receive a confirmation SMS from M-PESA.
        </li>
        <li className="text-lg">
          Enter transaction code.
        </li>
      </ol>

      <p className="font-semibold text-lg text-gray-800 mt-4">
        Mpesa Recipient Name: <span className="font-bold text-blue-600">microplug </span>
      </p>
    </div>
    </div>
  )
}

export default Paymentinfo
