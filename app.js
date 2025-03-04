
  const firebaseConfig = {
    apiKey: "AIzaSyCOA_2bf_b1o1nXSHZO5Re5DjSD66Pa6MY",
    authDomain: "raona0.firebaseapp.com",
    projectId: "raona0",
    storageBucket: "raona0.appspot.com",
    messagingSenderId: "797719983777",
    appId: "1:797719983777:web:aa4490f3e9f6f435ec62e0"
  };

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


const payNowBtn = document.getElementById("payNowBtn");

payNowBtn.addEventListener("click", function () {
  // Get the logged-in user's email (Assumed user is already logged in)
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to proceed with payment.");
    return;
  }

  // Prepare payment options
  const options = {
    key: "rzp_test_3ADFKimnCz8iXo",  // Replace with your Razorpay key
    amount: 2 * 100,  // 257 INR
    currency: "INR",
    name: "ASTRIQUES",
    description: "PowerFul Thinking",
    image: "copy.png", // Add logo URL if available
    handler: function (response) { 
      const paymentId = response.razorpay_payment_id;
      const signature = response.razorpay_signature;
      
      // Verify payment success (client-side verification)
      const razorpayOrderId = response.razorpay_order_id;

      // Verify signature (this is the critical client-side verification)
      verifyPayment(razorpayOrderId, paymentId, signature, user.email);
    },
    prefill: {
      name: user.displayName || "Username",
      email: user.email,
      contact: "9876543210",
    },
    theme: {
      color: "#6a5acd"
    }
  };

  // Open Razorpay Checkout
  const razorpay = new Razorpay(options);
  razorpay.open();
});

// Verify payment on client-side
function verifyPayment(orderId, paymentId, signature, email) {
  const generatedSignature = RazorpayClient.generateSignature({
    order_id: orderId,
    payment_id: paymentId
  });

  if (generatedSignature === signature) {
    // Payment verified successfully
    showToast("Payment Successful!", "success");

    // Add user's email to Firestore in the "paid" collection
    db.collection("paid").add({
      email: email,
      paymentId: paymentId,
      amount: 257,  // Payment amount
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log("User added to 'paid' collection in Firestore");
    })
    .catch((error) => {
      console.error("Error adding user to Firestore: ", error);
    });
  } else {
    showToast("Payment Verification Failed!", "error");
  }
}

// Show Toast Notifications
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


function showdata(x) {
    const all = document.getElementById("all")
    const p = document.getElementById("p")
    const main = document.getElementById("main")

    if (x == "all") {
        all.classList.add("active")
p.classList.remove("active") 
       main.innerHTML = `
         <div class="card"> 
                <div class="trend">NEW</div>
                <div class="image">
                    <img src="copy.png" alt="">
                </div> 
                <div class="data">
                    <div class="name">POWERFUL THINKING</div>
                    <div class="price">INR 257.00</div> 
                    <button id="payNowBtn" class="btn" style="width: 100%;">Pay Now</button>
                </div>
            </div>
        `
    }
    else {
        p.classList.add("active")
        all.classList.remove("active")
        main.innerHTML = "Loading..."
        checkIfUserIsPaid();
    }
}

// Function to check if the user is in the "paid" collection
function checkIfUserIsPaid() {
    const main = document.getElementById("main")
    const user = auth.currentUser;  // Get the current logged-in user
    
    if (user) {
      const userEmail = user.email;  // Get the user's email address
  
      // Query the "paid" collection in Firestore to see if the user's email exists
      db.collection("paid")
        .where("email", "==", userEmail)  // Check if the email matches
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            main.innerHTML = `
             <div class="card"> 
                <div class="trend">NEW</div>
                <div class="image">
                    <img src="copy.png" alt="">
                </div> 
                <div class="data">
                    <div class="name">POWERFUL THINKING</div>
                    <div class="price">PURCHASED</div> 
                    <button id="read"  onclick="readx()" class="btn" style="width: 100%;">Read Course</button>
                </div>
            `
          } else {
            // User is not in the "paid" collection
            main.innerHTML = "<h2>NO COURSES PURCHASED</h2>"
            console.log("User not found in 'paid' collection.");
          }
        })
        .catch(error => {
          console.error("Error checking 'paid' collection:", error);
        });
    } else {
      console.log("No user is logged in.");
    }
  }
  
  function readx() {
    pdfUrl = 'http://astriques.in.net/POWERFUL+THINKING+FINAL-1_Converted.pdf#toolbar=0&navpanes=0&scrollbar=0'
document.getElementById("main").innerHTML = `<embed src="${pdfUrl}" width="100%" height="100%">`
  }
document.addEventListener('keyup', (e)=> {
    navigator.clipboard.writeText('');
    showToast("Screenshot is blocked!")
})
 // Function to handle keydown events
 function handleKeyDown(event) {
    // List of key codes to disable
    const disabledKeys = [
      8,    // Backspace
      9,    // Tab
      13,   // Enter
      27,   // Escape
      33,   // Page Up
      34,   // Page Down
      35,   // End
      36,   // Home
      37,   // Left Arrow
      38,   // Up Arrow
      39,   // Right Arrow
      40,   // Down Arrow
      44,   // Print Screen
      45,   // Insert
      46,   // Delete
      112,  // F1
      113,  // F2
      114,  // F3
      115,  // F4
      116,  // F5
      117,  // F6
      118,  // F7
      119,  // F8
      120,  // F9
      121,  // F10
      122,  // F11
      123   // F12
    ];

    // Check if the pressed key is in the disabledKeys array
    if (disabledKeys.includes(event.keyCode)) {
      event.preventDefault(); // Prevent the default action
      console.log(`Key with code ${event.keyCode} is disabled.`);
    }
  }

  // Attach the handleKeyDown function to the keydown event
  document.addEventListener('keydown', handleKeyDown);
