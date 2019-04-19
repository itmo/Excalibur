import * as ex from '../../build/dist/excalibur';
import { TestUtils } from './util/TestUtils';

describe('A pointer', () => {
  var engine: ex.Engine = null;

  function executeMouseEvent(type: string, target: HTMLElement, button: ex.Input.NativePointerButton = null, x: number = 0, y: number = 0) {
    // var mouseEvent = document.createEvent('MouseEvent');
    // mouseEvent.initMouseEvent(type, true, true, document.defaultView, button, x, y, x, y,
    //     false, false, false, false, button, target);

    var evt = new PointerEvent(type, {
      clientX: x,
      clientY: y,
      button: button
    });

    target.dispatchEvent(evt);
  }

  beforeEach(() => {
    engine = TestUtils.engine();
    engine.start();
  });

  afterEach(() => {
    engine.stop();
  });

  it('should exist', () => {
    expect(ex.Input.Pointers).toBeDefined();
    expect(engine.input.pointers).toBeTruthy();
  });

  it('should detect pointer event', () => {
    expect((<any>window).PointerEvent).toBeDefined();
  });

  it('should fire pointerdown events', () => {
    var eventLeftFired = false;
    var eventRightFired = false;
    var eventMiddleFired = false;
    engine.input.pointers.primary.on('down', (ev: ex.Input.PointerEvent) => {
      if (ev.button === ex.Input.PointerButton.Left) {
        eventLeftFired = true;
      }
      if (ev.button === ex.Input.PointerButton.Right) {
        eventRightFired = true;
      }
      if (ev.button === ex.Input.PointerButton.Middle) {
        eventMiddleFired = true;
      }
    });

    executeMouseEvent('pointerdown', <any>document, ex.Input.NativePointerButton.Left);
    executeMouseEvent('pointerdown', <any>document, ex.Input.NativePointerButton.Right);
    executeMouseEvent('pointerdown', <any>document, ex.Input.NativePointerButton.Middle);

    expect(eventLeftFired).toBe(true, 'left should fire');
    expect(eventRightFired).toBe(true, 'right should fire');
    expect(eventMiddleFired).toBe(true, 'middle should fire');
  });

  it('should fire pointerup events', () => {
    var eventLeftFired = false;
    var eventRightFired = false;
    var eventMiddleFired = false;

    engine.input.pointers.primary.on('up', function(ev: ex.Input.PointerEvent) {
      if (ev.button === ex.Input.PointerButton.Left) {
        eventLeftFired = true;
      }
      if (ev.button === ex.Input.PointerButton.Right) {
        eventRightFired = true;
      }
      if (ev.button === ex.Input.PointerButton.Middle) {
        eventMiddleFired = true;
      }
    });

    executeMouseEvent('pointerup', <any>document, ex.Input.NativePointerButton.Left);
    executeMouseEvent('pointerup', <any>document, ex.Input.NativePointerButton.Right);
    executeMouseEvent('pointerup', <any>document, ex.Input.NativePointerButton.Middle);

    expect(eventLeftFired).toBeTruthy('left should fire');
    expect(eventRightFired).toBeTruthy('right should fire');
    expect(eventMiddleFired).toBeTruthy('middle should fire');
  });

  it('should fire pointermove events', () => {
    var eventMoveFired = false;

    engine.input.pointers.primary.on('move', function(ev: ex.Input.PointerEvent) {
      eventMoveFired = true;
    });

    executeMouseEvent('pointermove', <any>document);

    expect(eventMoveFired).toBeTruthy();
  });

  it('should update last position on down and move', () => {
    executeMouseEvent('pointerdown', <any>document, null, 10, 800);
    expect(engine.input.pointers.primary.lastPagePos.x).toBe(10);
    expect(engine.input.pointers.primary.lastPagePos.y).toBe(800);

    executeMouseEvent('pointermove', <any>document, null, 100, 200);

    expect(engine.input.pointers.primary.lastPagePos.x).toBe(100);
    expect(engine.input.pointers.primary.lastPagePos.y).toBe(200);

    executeMouseEvent('pointermove', <any>document, null, 300, 400);

    expect(engine.input.pointers.primary.lastPagePos.x).toBe(300);
    expect(engine.input.pointers.primary.lastPagePos.y).toBe(400);
  });

  it('should not throw when checking if actors are under pointer if no pointer events have happened yet', () => {
    let actor = new ex.Actor({ x: 50, y: 50, width: 100, height: 100 });
    expect(() => engine.input.pointers.primary.isActorUnderPointer(actor)).not.toThrowError();
    expect(engine.input.pointers.primary.isActorUnderPointer(actor)).toBe(false);
  });

  it('should return true when an actor is under the pointer', () => {
    let actor = new ex.Actor({ x: 50, y: 50, width: 100, height: 100 });
    executeMouseEvent('pointerdown', <any>document, null, 50, 50);

    expect(engine.input.pointers.primary.isActorUnderPointer(actor)).toBe(true);
  });
});
