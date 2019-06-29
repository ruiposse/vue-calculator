import { shallowMount } from '@vue/test-utils'
import Calc from '@/components/Calc'
import { stringTypeAnnotation } from '@babel/types';

describe('Calc', () => {
  let wrapper
  let number1
  let number2
  let operation

  beforeEach(() => {
    wrapper = shallowMount(Calc)
    number1 = { target: { textContent: '3' } }
    number2 = { target: { textContent: '2' } }
    operation = { target: { textContent: '+' } }
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should clear the input', () => {
    expect(wrapper.vm.result).toEqual(0)
    wrapper.vm.inputNumber(number1)
    wrapper.vm.addOperation(operation)

    wrapper.vm.reset()
    expect(wrapper.vm.opStack.length).toEqual(0)
    expect(wrapper.vm.result).toEqual(0)
  })

  it('should do sum', () => {
    wrapper.vm.inputNumber(number1)
    expect(wrapper.vm.opStack.length).toEqual(1)

    wrapper.vm.addOperation(operation)
    expect(wrapper.vm.opStack.length).toEqual(2)

    wrapper.vm.inputNumber(number2)
    expect(wrapper.vm.opStack.length).toEqual(3)

    wrapper.vm.calc()

    expect(wrapper.vm.result).toEqual(5)
    expect(wrapper.vm.opStack.length).toEqual(0)
  })

  it('should multiply', () => {
    operation.target.textContent = 'x'

    wrapper.vm.inputNumber(number1)
    expect(wrapper.vm.opStack.length).toEqual(1)

    wrapper.vm.addOperation(operation)
    expect(wrapper.vm.opStack.length).toEqual(2)

    wrapper.vm.inputNumber(number2)
    expect(wrapper.vm.opStack.length).toEqual(3)

    wrapper.vm.calc()

    expect(wrapper.vm.result).toEqual(6)
    expect(wrapper.vm.opStack.length).toEqual(0)
  })

  it('should subtract', () => {
    operation.target.textContent = '-'

    wrapper.vm.inputNumber(number1)
    expect(wrapper.vm.opStack.length).toEqual(1)

    wrapper.vm.addOperation(operation)
    expect(wrapper.vm.opStack.length).toEqual(2)

    wrapper.vm.inputNumber(number2)
    expect(wrapper.vm.opStack.length).toEqual(3)

    wrapper.vm.calc()

    expect(wrapper.vm.result).toEqual(1)
    expect(wrapper.vm.opStack.length).toEqual(0)
  })

  it('should divide', () => {
    operation.target.textContent = '/'

    wrapper.vm.inputNumber(number1)
    expect(wrapper.vm.opStack.length).toEqual(1)

    wrapper.vm.addOperation(operation)
    expect(wrapper.vm.opStack.length).toEqual(2)

    wrapper.vm.inputNumber(number2)
    expect(wrapper.vm.opStack.length).toEqual(3)

    wrapper.vm.calc()

    expect(wrapper.vm.result).toEqual(1.5)
    expect(wrapper.vm.opStack.length).toEqual(0)
  })

  describe('operations', () => {
    it('should not do calculation if not enough parameters', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.calc()
      expect(wrapper.vm.opStack.length).toEqual(1)
    })

    it('should calculate if another operation is added', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputNumber(number2)
      wrapper.vm.addOperation(operation)

      expect(wrapper.vm.opStack.length).toEqual(2)
      expect(wrapper.vm.result).toEqual(5)
    })

    it('should calculate using previous result of another operation', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputNumber(number2)
      wrapper.vm.calc()
      wrapper.vm.addOperation(operation)
      expect(wrapper.vm.opStack.length).toEqual(2)
      expect(wrapper.vm.result).toEqual(5)

      wrapper.vm.inputNumber(number2)
      wrapper.vm.calc()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(7)
    })

    it('should change operation if an operation is already added', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      
      operation.target.textContent = 'x'
      wrapper.vm.addOperation(operation)

      expect(wrapper.vm.opStack.length).toEqual(2)
      expect(wrapper.vm.opStack[1]).toEqual('x')
    })
  })

  describe('input dot', () => {
    it('should input "0."', () => {
      wrapper.vm.inputDot()
      expect(wrapper.vm.opStack.length).toEqual(1)
      expect(wrapper.vm.result).toEqual('0.')
    })

    it('should input "0." automatically for second part of calculation', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputDot()

      expect(wrapper.vm.opStack.length).toEqual(3)
      expect(wrapper.vm.opStack[2]).toEqual(0)
      expect(wrapper.vm.result).toEqual('0.')
    })

    it('should input decimal numbers', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.inputDot()
      wrapper.vm.inputNumber(number2)

      expect(wrapper.vm.opStack.length).toEqual(1)
      expect(wrapper.vm.result).toEqual('3.2')
    })

    it('should not allow more dots if number is already decimal', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.inputDot()
      wrapper.vm.inputNumber(number2)
      wrapper.vm.inputDot()

      expect(wrapper.vm.opStack.length).toEqual(1)
      expect(wrapper.vm.result).toEqual('3.2')
    })
  })

  describe('inverse signal', () => {
    it('should inverse signal', () => {
      wrapper.vm.inputNumber(number1)
      expect(wrapper.vm.opStack.length).toEqual(1)
      
      wrapper.vm.inverseSignal()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(-3)
    })

    it('should not inverse signal of zero', () => {
      wrapper.vm.reset()
      wrapper.vm.inverseSignal()
      expect(wrapper.vm.result).toEqual(0)
    })

    it('should inverse signal of previous number', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      expect(wrapper.vm.opStack.length).toEqual(2)

      wrapper.vm.inverseSignal()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(-3)
    })

    it('should inverse signal after a calculation result', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputNumber(number2)
      wrapper.vm.calc()

      wrapper.vm.inverseSignal()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(-5)
    })
  })

  describe('square root', () => {
    it('should calculate square root', () => {
      number1.target.textContent = '9'
      wrapper.vm.inputNumber(number1)
      wrapper.vm.sq()
  
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(3)
    })

    it('should calculate square root of previous number', () => {
      number1.target.textContent = '9'
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      expect(wrapper.vm.opStack.length).toEqual(2)

      wrapper.vm.sq()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(3)
    })

    it('should calculate square root after a calculation result', () => {
      operation.target.textContent = 'x'
      number2.target.textContent = '3'
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputNumber(number2)
      wrapper.vm.calc()

      wrapper.vm.sq()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(3)
    })
  })

  describe('percentage', () => {
    it('should calculate percentage', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.percentage()
  
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(0.03)
    })

    it('should calculate percentage of previous number', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      expect(wrapper.vm.opStack.length).toEqual(2)

      wrapper.vm.percentage()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(0.03)
    })

    it('should calculate percentage after a calculation result', () => {
      wrapper.vm.inputNumber(number1)
      wrapper.vm.addOperation(operation)
      wrapper.vm.inputNumber(number2)
      wrapper.vm.calc()

      wrapper.vm.percentage()
      expect(wrapper.vm.opStack.length).toEqual(0)
      expect(wrapper.vm.result).toEqual(0.05)
    })
  })
})
