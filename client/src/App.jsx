import { useEffect, useRef, useState } from "react";
import "./App.css";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";

function App() {
  const [saveUrl, setSaveUrl] = useState("");
  const [base64String, setBase64String] = useState("");
  const [isValidImage, setIsValidImage] = useState(false);

  const [menu, setMenu] = useState("saveMenu");

  const [collection, setCollection] = useState([])

  let memo = useRef("");

  async function getData() {
    const url = "http://localhost:8000/getCollection";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      setCollection(json);
    } catch (error) {
      console.error(error.message);
    }
  }


  const [carouselState, setCarouselState] = useState({
    goToSlide: 0,
    offsetRadius: 4,
    showNavigation: true,
    config: config.slow,
    dragging: false,
    dragStartX: 0,
    dragOffset: 0,
  });

  

  const slides = collection.map((item, index) => ({
    key: uuidv4(),
    content: (
      <img
        src={item.base64}
        alt={`${index + 1}`}
      />
    ),
  }));

  function handleChangeMenu(menu) {
    setMenu(menu);
    if(menu==="getMenu"){
      getData();
    }
  }

  async function validateImage(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      // Kiểm tra xem loại MIME có phải là hình ảnh không
      const isValidImage = contentType && contentType.startsWith('image/');
      setIsValidImage(isValidImage);
    } catch (error) {
      console.error('Lỗi khi kiểm tra hình ảnh:', error);
      setIsValidImage(false);
    }
  }

  function handleSaveUrlChange(e) {
    const url = e.target.value;

    validateImage(url);
    memo.current = url;
    setSaveUrl(url);
    



  }


  function handleSaveUrlClick() {
    
    
    if (isValidImage === true && base64String!=="") {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: base64String }),
      };
      fetch("http://localhost:8000/postImage", requestOptions);
    }
  }

  useEffect(()=>{
    if(isValidImage===true){
      fetch(memo.current)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setBase64String(reader.result);
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.log(""));
    }
    
  })

  useEffect(()=>{
    console.log(base64String);
    console.log(isValidImage);
    console.log(memo.current);
    
    
  })

  return (
    <div className="App">
      <div className="wrapper">
        <header>
          <ul>
            <li
              onClick={() => handleChangeMenu("saveMenu")}
              className={menu === "saveMenu" ? "activeMenu" : "passiveMenu"}
            >
              SAVE IMAGE
            </li>
            <li
              onClick={() => handleChangeMenu("getMenu")}
              className={menu === "saveMenu" ? "passiveMenu" : "activeMenu"}
            >
              GET COLLECTION
            </li>
          </ul>
        </header>
        {menu === "saveMenu" ? (
          <>
            <div className="body-wrapper">
              <div className="input-url">
                <div>YOUR IMAGE URL:</div>
                <input type="text" onChange={(e) => handleSaveUrlChange(e)} defaultValue={memo.current}></input>
              </div>
              <div className="display-image">
                <img src={saveUrl}></img>
              </div>
            </div>
            <div className="button-wrapper">
              <button onClick={handleSaveUrlClick}>SAVE</button>
            </div>
          </>
        ) : (
          <>
            <>
              <div className="body-wrapper">
                <div className="carousel-wrapper">
                  <div
                    className="carousel"
                  >
                    <Carousel
                      slides={slides}
                      goToSlide={carouselState.goToSlide}
                      offsetRadius={carouselState.offsetRadius}
                      animationConfig={carouselState.config}
                    />
                  </div>
                  <div className="carousel-slide-number">
                    {/* Navigation */}
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <button
                        style={{
                          display: "inline-block",
                          fontSize: "24px",
                          cursor:
                            carouselState.goToSlide === 0
                              ? "not-allowed"
                              : "pointer",
                          marginRight: "10px",
                          color:
                            carouselState.goToSlide === 0 ? "#888" : "#000",
                            backgroundColor:"#fff",
                            border:"none",
                            width:"50px",
                          height:"50px",
                          fontSize:"24px"
                        }}
                        onClick={() =>
                          carouselState.goToSlide > 0 &&
                          setCarouselState((prevState) => ({
                            ...prevState,
                            goToSlide: prevState.goToSlide - 1,
                          }))
                        }
                      >
                        &#8249;
                      </button>
                      {slides.map((slide, index) => (
                        <button
                          key={slide.key}
                          style={{
                            display: "inline-block",
                            fontSize: "16px",
                            cursor: "pointer",
                            margin: "0 5px",
                            color:
                              index === carouselState.goToSlide
                                ? "#000"
                                : "#888",
                            backgroundColor:"#fff",
                            border:"none",
                          }}
                          onClick={() =>
                            setCarouselState((prevState) => ({
                              ...prevState,
                              goToSlide: index,
                            }))
                          }
                        >
                          &bull;
                        </button>
                      ))}
                      <button
                        style={{
                          display: "inline-block",
                          fontSize: "24px",
                          cursor:
                            carouselState.goToSlide === slides.length - 1
                              ? "not-allowed"
                              : "pointer",
                          color:
                            carouselState.goToSlide === slides.length - 1
                              ? "#888"
                              : "#000",
                          backgroundColor:"#fff",
                            border:"none",
                          width:"50px",
                          height:"50px",
                          fontSize:"24px"
                        }}
                        onClick={() =>
                          carouselState.goToSlide < slides.length - 1 &&
                          setCarouselState((prevState) => ({
                            ...prevState,
                            goToSlide: prevState.goToSlide + 1,
                          }))
                        }
                      >
                        &#8250;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
