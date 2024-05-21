<div class="spinner-wrapper">
  <div class="spinner-content">
    <div></div>
    <div></div>
    <div>
      <div></div>
    </div>
    <div>
      <div></div>
    </div>
  </div>
</div>

<style>
  @keyframes spinner-content {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .spinner-content div {
    box-sizing: border-box !important;
  }

  .spinner-content > div {
    position: absolute;
    width: 136px;
    height: 136px;
    top: 32px;
    left: 32px;
    border-radius: 50%;
    border: 8px solid #000;
    border-color: #93dbe9 transparent #93dbe9 transparent;
    animation: spinner-content 1s linear infinite;
  }

  .spinner-content > div:nth-child(2),
  .spinner-content > div:nth-child(4) {
    width: 116px;
    height: 116px;
    top: 42px;
    left: 42px;
    animation: spinner-content 1s linear infinite reverse;
  }

  .spinner-content > div:nth-child(2) {
    border-color: transparent #689cc5 transparent #689cc5;
  }

  .spinner-content > div:nth-child(3) {
    border-color: transparent;
  }

  .spinner-content > div:nth-child(3) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
  }

  .spinner-content > div:nth-child(3) div:before,
  .spinner-content > div:nth-child(3) div:after {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    top: -8px;
    left: 56px;
    background: #93dbe9;
    border-radius: 50%;
    box-shadow: 0 128px 0 0 #93dbe9;
  }

  .spinner-content > div:nth-child(3) div:after {
    left: -8px;
    top: 56px;
    box-shadow: 128px 0 0 0 #93dbe9;
  }

  .spinner-content > div:nth-child(4) {
    border-color: transparent;
  }

  .spinner-content > div:nth-child(4) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
  }

  .spinner-content > div:nth-child(4) div:before,
  .spinner-content > div:nth-child(4) div:after {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    top: -8px;
    left: 46px;
    background: #689cc5;
    border-radius: 50%;
    box-shadow: 0 108px 0 0 #689cc5;
  }

  .spinner-content > div:nth-child(4) div:after {
    left: -8px;
    top: 46px;
    box-shadow: 108px 0 0 0 #689cc5;
  }

  .spinner-wrapper {
    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
    background: none;
  }

  .spinner-content {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0;
  }

  .spinner-content div {
    box-sizing: content-box;
  }
</style>
