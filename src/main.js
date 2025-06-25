import kaplay from "kaplay";
const k = kaplay({
  background: "#11ACF6",
});

k.debug.inspect = true;
k.loadRoot("./");
k.loadSprite("balde", "sprites/balde-sprites.png", {
  sliceY: 3,
});
k.loadSprite("gota", "sprites/gota.png");
k.loadSprite("fundo", "sprites/background.png");

k.loadSound("pingo", "sounds/pingo.mp3");
k.loadSound("splash", "sounds/water-splash.mp3");

const chao = k.add([
  k.rect(k.width(), 200),
  k.color("#9B7653"),
  k.anchor("botleft"),
  k.pos(0, k.height()),
  k.area(),
  "chao",
]);

const balde = k.add([
  k.sprite("balde", {
    width: 200,
  }),
  k.anchor("center"),
  k.area({
    shape: new k.Rect(k.vec2(0, 0), 100, 110),
  }),
  k.pos(k.center().x, chao.pos.y - chao.height),
  {
    numeroGotas: 0,
  },
  "balde",
]);

balde.onMouseDown(() => {
  balde.pos.x = k.mousePos().x;
  const metadeLargura = balde.area.shape.width / 2;
  if (balde.pos.x > k.width() - metadeLargura) {
    balde.pos.x = k.width() - metadeLargura;
  }
  if (balde.pos.x < metadeLargura) {
    balde.pos.x = metadeLargura;
  }
});

const pontos = k.add([k.text("Pontos: 0"), k.pos(20, 30)]);

k.setGravity(700);

function criarGota(posX) {
  const gota = k.add([
    k.sprite("gota", {
      width: 100,
    }),
    k.pos(posX, -10),
    k.anchor("center"),
    k.body(),
    k.area({
      shape: new k.Rect(k.vec2(0, -5), 40, 60),
    }),
  ]);

  gota.onCollide("chao", (chao) => {
    k.play("splash");
    balde.numeroGotas -= 1;
    if (balde.numeroGotas < 0) {
      balde.numeroGotas = 0;
    }
    pontos.text = "Pontos: " + balde.numeroGotas;
    gota.destroy();
  });

  gota.onCollide("balde", (balde) => {
    gota.destroy();
    k.play("pingo");
    balde.numeroGotas += 1;
    pontos.text = "Pontos: " + balde.numeroGotas;

    if (balde.numeroGotas > 5) {
      balde.frame = 1;
    }
    if (balde.numeroGotas > 10) {
      balde.frame = 2;

      k.wait(1, () => (balde.frame = 1));
    }
  });
}

k.loop(1.5, () => {
  const xAleatorio = k.rand(10, k.width() - 10);
  criarGota(xAleatorio);
});
