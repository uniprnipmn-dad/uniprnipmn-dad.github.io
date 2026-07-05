const targetDate = new Date(2027, 4, 15);
const today = new Date();
const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const msPerDay = 24 * 60 * 60 * 1000;

const trainingPlan = [
  {
    name: "准备周",
    short: "调整状态<br>积极备赛",
    focus: "轻松跑 35-45 分钟，结束后做 12 分钟动态拉伸。把睡眠、饮水和装备清单先稳住。",
    tip: "配速保持能完整说话的强度，不追速度。鞋袜、背包、水袋今天适合做一次舒适度检查。",
    color: "#f27d3d",
  },
  {
    name: "爬升训练日",
    short: "提升耐力<br>强化爬升",
    focus: "安排 6-8 组坡跑，每组 2 分钟上坡，慢走或慢跑下坡恢复。核心目标是稳定步频。",
    tip: "上坡缩短步幅，手臂主动摆动。下坡不要急刹，保护膝盖和脚踝。",
    color: "#f2c23a",
  },
  {
    name: "速度训练日",
    short: "提升速度<br>增强心肺",
    focus: "热身后完成 5 组 800 米节奏跑，组间慢跑 3 分钟。最后做 10 分钟放松跑。",
    tip: "速度日只需要八九分努力，动作放松比硬顶更重要。训练后 30 分钟内补充碳水和蛋白。",
    color: "#55a6d9",
  },
  {
    name: "长距离日",
    short: "有氧耐力<br>持续输出",
    focus: "完成 90-150 分钟低强度越野或公路慢跑，途中练习补水和能量胶节奏。",
    tip: "今天重在时间和补给，不必追求配速。每 35-45 分钟补一次能量更接近比赛节奏。",
    color: "#63bd72",
  },
  {
    name: "技术训练日",
    short: "技术提升<br>应对复杂",
    focus: "找台阶、碎石路或林道练习落脚、下坡小步频和转弯控制，控制在 50-70 分钟。",
    tip: "眼睛看前方 3-5 米，提前选线。遇到湿滑路面，宁可短步快频也不要跨大步。",
    color: "#9b7bd0",
  },
  {
    name: "恢复调整日",
    short: "主动恢复<br>放松身心",
    focus: "轻松骑行、游泳或快走 30-45 分钟，再做泡沫轴放松小腿、臀腿和足底。",
    tip: "恢复日不是偷懒，是让身体吸收训练。今天尽量早睡，少熬夜。",
    color: "#ee5d5d",
  },
  {
    name: "减量日",
    short: "减量训练<br>保持状态",
    focus: "慢跑 25-40 分钟，加 4 组 20 秒加速跑，让身体保持轻快但不累积疲劳。",
    tip: "如果腿沉或心率偏高，直接改成散步和拉伸。减量的目标是新鲜感。",
    color: "#f19b2e",
  },
];

const weatherByMonth = {
  0: ["寒冷多云", -3, 7, "山路可能有冰，优先选择防滑路线。"],
  1: ["冷空气间歇", 0, 9, "早晚温差明显，热身时间要加长。"],
  2: ["阴晴转换", 5, 14, "春季山风偏凉，带一件轻薄防风层。"],
  3: ["春雨增多", 9, 18, "林道湿滑，练习短步频和稳定落脚。"],
  4: ["赛季暖湿", 13, 23, "接近比赛，重点适应湿热和补水节奏。"],
  5: ["温暖有阵雨", 17, 26, "雨后湿度高，训练后及时换干衣。"],
  6: ["炎热潮湿", 20, 29, "避开正午，补电解质。"],
  7: ["闷热雷阵雨", 19, 28, "关注雷雨，山地训练留退路。"],
  8: ["秋初湿润", 16, 25, "林下路面可能潮湿，鞋底抓地要检查。"],
  9: ["清凉少雨", 10, 20, "适合长距离，但早晚要保暖。"],
  10: ["冷暖切换", 4, 15, "风大时控制出汗，避免训练后受凉。"],
  11: ["低温干冷", -1, 9, "低温下先热身再提强度。"],
};

const tagGrid = document.querySelector("#tagGrid");
const heroDays = document.querySelector("#heroDays");
const sideDays = document.querySelector("#sideDays");
const legend = document.querySelector("#legend");
const searchInput = document.querySelector("#searchInput");
const dialog = document.querySelector("#detailDialog");
const closeDialog = document.querySelector("#closeDialog");
const dialogDate = document.querySelector("#dialogDate");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogArt = document.querySelector("#dialogArt");
const weatherStrip = document.querySelector("#weatherStrip");
const trainingAdvice = document.querySelector("#trainingAdvice");
const dailyTip = document.querySelector("#dailyTip");

const daysLeftToday = Math.max(0, Math.round((targetDate - startDate) / msPerDay));
heroDays.textContent = daysLeftToday;
sideDays.textContent = daysLeftToday;

const formatDate = (date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

const formatShortDate = (date) =>
  `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;

const seeded = (date, salt = 0) => {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate() +
    salt * 97;
  return Math.abs(Math.sin(seed) * 10000) % 1;
};

function getWeather(date) {
  const base = weatherByMonth[date.getMonth()];
  const low = Math.round(base[1] + seeded(date, 1) * 4 - 2);
  const high = Math.round(base[2] + seeded(date, 2) * 5 - 1);
  const rain = Math.round(18 + seeded(date, 3) * (date.getMonth() >= 3 && date.getMonth() <= 8 ? 58 : 32));
  const wind = ["1-2级", "2-3级", "3-4级"][Math.floor(seeded(date, 4) * 3)];

  return {
    condition: base[0],
    range: `${low}°C / ${Math.max(low + 4, high)}°C`,
    rain: `${rain}%`,
    wind,
    note: base[3],
  };
}

function createTrailSvg(color, variant) {
  const ridge = variant % 3;
  const sky = ridge === 0 ? "#f7e1bd" : ridge === 1 ? "#d7edf9" : "#e4dcf4";
  const mountain = ridge === 0 ? "#744a2b" : ridge === 1 ? "#164d75" : "#47305f";
  const tree = ridge === 0 ? "#1e3d24" : ridge === 1 ? "#0b3653" : "#21381f";

  return `
    <svg class="tag-art" viewBox="0 0 210 150" aria-hidden="true">
      <defs>
        <linearGradient id="sky-${variant}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${sky}" stop-opacity="0.95"/>
          <stop offset="1" stop-color="${color}" stop-opacity="0.32"/>
        </linearGradient>
      </defs>
      <rect width="210" height="150" fill="url(#sky-${variant})"/>
      <path d="M0 74 C34 62 49 44 78 56 C103 66 113 30 143 45 C170 58 177 42 210 52 L210 150 L0 150 Z" fill="${mountain}" opacity="0.28"/>
      <path d="M0 98 C30 78 54 74 84 88 C114 104 133 75 166 86 C184 92 196 88 210 81 L210 150 L0 150 Z" fill="${mountain}" opacity="0.7"/>
      <path d="M98 150 C99 133 119 118 129 101 C138 85 139 68 159 54" fill="none" stroke="#f7f2d9" stroke-width="12" stroke-linecap="round"/>
      <path d="M98 150 C99 133 119 118 129 101 C138 85 139 68 159 54" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
      <path d="M16 127 l10 -25 l10 25 h-7 l8 15 h-28 l8 -15 Z M44 119 l9 -23 l10 23 h-7 l8 14 h-27 l8 -14 Z M173 126 l11 -27 l11 27 h-8 l9 16 h-31 l9 -16 Z" fill="${tree}" opacity="0.92"/>
      <circle cx="87" cy="69" r="7" fill="#111"/>
      <path d="M86 77 l-8 18 l16 9 M88 79 l18 5 M82 93 l-17 15 M94 102 l9 18" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 47 C36 35 58 36 82 43 M123 27 C145 18 169 21 199 32" fill="none" stroke="#fff" stroke-width="3" opacity="0.7"/>
      <path d="M0 139 C42 127 88 129 128 138 C158 145 184 143 210 135" fill="none" stroke="#fff" stroke-width="2" opacity="0.55"/>
    </svg>`;
}

function createTag(day, index) {
  const plan = trainingPlan[index % trainingPlan.length];
  const daysLeft = Math.max(0, Math.round((targetDate - day) / msPerDay));
  const tag = document.createElement("button");
  tag.className = "train-tag";
  tag.type = "button";
  tag.style.setProperty("--accent", plan.color);
  tag.dataset.search = `${formatDate(day)} ${formatShortDate(day)} ${plan.name} ${daysLeft}`;
  tag.innerHTML = `
    <div class="tag-head">
      <span>第${index + 1}天</span>
      <span class="tag-date">${formatShortDate(day)}</span>
    </div>
    <div class="tag-body">
      <div class="tag-days">${daysLeft}</div>
      <div class="tag-race">神农架越野跑<br>倒计时</div>
      ${createTrailSvg(plan.color, index)}
    </div>
    <div class="tag-foot">
      <span class="tag-pill">${plan.name}</span>
      <p>${plan.short}</p>
    </div>
  `;

  tag.addEventListener("click", () => openDetail(day, index, plan));
  return tag;
}

function openDetail(day, index, plan) {
  const weather = getWeather(day);
  dialogDate.textContent = `第${index + 1}天 · ${formatDate(day)} · 倒计时${Math.max(0, Math.round((targetDate - day) / msPerDay))}天`;
  dialogTitle.textContent = plan.name;
  dialogArt.style.backgroundImage = `
    linear-gradient(0deg, rgba(8, 13, 15, 1), transparent 44%),
    linear-gradient(110deg, ${plan.color}55, transparent 40%),
    url("hero-reference.png")
  `;
  weatherStrip.innerHTML = `
    <div class="weather-card"><b>天气</b><span>${weather.condition}</span></div>
    <div class="weather-card"><b>气温</b><span>${weather.range}</span></div>
    <div class="weather-card"><b>降雨 / 山风</b><span>${weather.rain} · ${weather.wind}</span></div>
  `;
  trainingAdvice.textContent = plan.focus;
  dailyTip.textContent = `${weather.note}${plan.tip}`;
  dialog.showModal();
}

function renderCalendar() {
  const totalDays = Math.max(0, Math.round((targetDate - startDate) / msPerDay));
  const fragment = document.createDocumentFragment();

  for (let i = 0; i <= totalDays; i += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    fragment.appendChild(createTag(day, i));
  }

  tagGrid.appendChild(fragment);
}

function renderLegend() {
  legend.innerHTML = trainingPlan
    .map(
      (plan) => `
        <div class="legend-item">
          <span class="legend-dot" style="--accent:${plan.color}"></span>
          <span>${plan.name}</span>
        </div>
      `,
    )
    .join("");
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".train-tag").forEach((tag) => {
    tag.classList.toggle("tag-hidden", keyword && !tag.dataset.search.toLowerCase().includes(keyword));
  });
});

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

renderLegend();
renderCalendar();
