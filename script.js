// Wait for OpenCV.js to load
cv.onRuntimeInitialized = () => {
    console.log("OpenCV.js is ready!");
  
    // Set up the video input and canvas output
    const videoInput = document.getElementById('videoInput');
    const canvasOutput = document.getElementById('canvasOutput');
    const context = canvasOutput.getContext('2d');
  
    // Access the webcam
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then((stream) => {
      videoInput.srcObject = stream;
      videoInput.play();
    }).catch((err) => {
      console.error("Error accessing webcam: " + err);
    });
  
    // Create an OpenCV Mat from the video feed
    let cap = new cv.VideoCapture(videoInput);
    let frame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
    let gray = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC1);
  
    // Process the video feed
    function processVideo() {
      // Capture a frame from the video feed
      cap.read(frame);
      
      // Convert the frame to grayscale
      cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
  
      // Apply a blur to reduce noise
      cv.GaussianBlur(gray, gray, new cv.Size(15, 15), 0);
  
      // Detect circles (representing the ball) using Hough Transform
      let circles = new cv.Mat();
      cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, gray.rows / 8, 100, 30, 20, 60);
  
      // Draw the detected circles on the canvas
      for (let i = 0; i < circles.cols; i++) {
        let circle = circles.data32F.slice(i * 3, i * 3 + 3);
        let center = new cv.Point(circle[0], circle[1]);
        let radius = circle[2];
  
        // Draw the circle and center on the canvas
        context.beginPath();
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.stroke();
  
        // Optional: Track the ball's movement or spin here
      }
  
      // Release resources for the next frame
      circles.delete();
      gray.delete();
  
      // Loop the video processing
      requestAnimationFrame(processVideo);
    }
  
    // Start processing the video feed
    processVideo();
  };
  
