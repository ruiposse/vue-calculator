<template>
  <div class="calc-wrapper">
    <div class="calc-header">
      <h6 class="calc-label">{{ progress }}</h6>
      <input type="text" v-model="result" class="calc-input" />
    </div>
    <table class="calc-table">
      <tr>
        <td @click="reset" class="calc-other">AC</td>
        <td @click="percentage" class="calc-other">%</td>
        <td @click="sq" class="calc-other">&#8730;</td>
        <td @click="addOperation" class="calc-operation">/</td>
      </tr>
      <tr>
        <td @click="inputNumber" class="calc-number">7</td>
        <td @click="inputNumber" class="calc-number">8</td>
        <td @click="inputNumber" class="calc-number">9</td>
        <td @click="addOperation" class="calc-operation">x</td>
      </tr>
      <tr>
        <td @click="inputNumber" class="calc-number">4</td>
        <td @click="inputNumber" class="calc-number">5</td>
        <td @click="inputNumber" class="calc-number">6</td>
        <td @click="addOperation" class="calc-operation">-</td>
      </tr>
      <tr>
        <td @click="inputNumber" class="calc-number">1</td>
        <td @click="inputNumber" class="calc-number">2</td>
        <td @click="inputNumber" class="calc-number">3</td>
        <td @click="addOperation" class="calc-operation">+</td>
      </tr>
      <tr>
        <td @click="inverseSignal" class="calc-number">±</td>
        <td @click="inputNumber" class="calc-number">0</td>
        <td @click="inputDot" class="calc-number">.</td>
        <td @click="calc" class="calc-operation">=</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opStack: [],
      result: 0,
    }
  },
  computed: {
    progress() {
      if (this.opStack.length) {
        let op = this.opStack[1] ? this.opStack[1] : ''
        return this.opStack[0] + ' ' + op
      } else {
        return ''
      }
    }
  },
  methods: {
    reset() {
      this.opStack = []
      this.result = 0
    },
    inputNumber(e) {
      if (!this.opStack.length || isNaN(this.opStack[this.opStack.length - 1])) {
        this.result = e.target.textContent
      }
      else {
        this.opStack.pop()
        this.result += e.target.textContent
      }
      this.opStack.push(parseFloat(this.result))
    },
    inputDot() {
      this.result += ''
      let value = parseFloat(this.result)
      if (value % 1 !== 0 || this.result.includes('.')) {
        return;
      }

      switch(this.opStack.length) {
        case 0:
          this.result += '.'
          break
        case 2:
          this.result = '0.'
          break
        case 1:
        case 3:
          this.opStack.pop()
          this.result += '.'
          break
      }

      this.opStack.push(parseFloat(this.result))
    },
    addOperation(e) {
      switch(this.opStack.length) {
        case 0:
          this.opStack.push(parseFloat(this.result))
          break
        case 2:
          this.opStack.pop()
          break
        case 3:
          this.calc()
          this.opStack.push(this.result)
          break
      }

      this.opStack.push(e.target.textContent)
    },
    percentage() {
      if (!this.opStack.length) {
        this.opStack.push(this.result)
      }

      let value = this.opStack.pop()
      if (isNaN(value) && this.opStack.length === 1) {
        value = this.opStack.pop()
      }
      this.result = parseFloat((value / 100).toPrecision(10))
    },
    sq() {
      if (!this.opStack.length) {
        this.opStack.push(this.result)
      }

      let value = this.opStack.pop()
      if (isNaN(value) && this.opStack.length === 1) {
        value = this.opStack.pop()
      }
      this.result = parseFloat(Math.sqrt(value).toPrecision(10))
    },
    inverseSignal() {
      if (!this.result) {
        return;
      }
      if (!this.opStack.length) {
        this.opStack.push(this.result)
      }

      let value = this.opStack.pop()
      if (isNaN(value) && this.opStack.length === 1) {
        value = this.opStack.pop()
      }
      this.result = value * -1
    },
    calc() {
      if (this.opStack.length !== 3) {
        return;
      }

      let current = this.opStack.pop()
      let op = this.opStack.pop()
      let tmp = this.opStack.pop()
      let res = 0;

      switch(op) {
        case '+':
          res = tmp + current
          break
        case '-':
          res = tmp - current
          break
        case 'x':
          res = tmp * current
          break
        case '/':
          res = tmp / current
          break
      }
      this.result = parseFloat((res.toPrecision(10)))
    }
  }
}
</script>

<style>
.calc-wrapper {
  margin: 0 auto;
  margin-top: 50px;
  width: 300px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  border-radius: 10px;
}

.calc-header {
  position: relative;
  height: 75px;
  background-color: #58595C;
}

.calc-input {
  position: absolute;
  bottom: 0;
  font-size: 2rem;
  font-weight: lighter;
  text-align: right;
  background-color: #58595C;
  width: 100%;
  color: #fff;
  padding: 5px;
  padding-right: 10px;
}

.calc-table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  cursor: pointer;
}

.calc-table td {
  border: 1px solid #000;
  padding: 15px;
}

.calc-number {
  background-color: #7D7D7F;
}

.calc-operation {
  background-color: #F2A23C;
}

.calc-other {
  background-color: #646467;
}

h6 {
  color: #eee;
  text-align: right;
  font-weight: lighter;
  padding: 5px;
  padding-right: 10px;
}
</style>
