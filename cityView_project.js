// 1.get all the relative dom elements to use for rendering
// 2.fetch pictures from backend
// 3.render them

let objs = {
    body: null,
    inputCity: null,
    btnSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext: null,
    page: {
        cursor:1, // 意思是，告诉后端：我们一开始想要读取的是“第一页”的数据，如果想从其他页开始读，换个数字就可以。用于API链接里，参考69行。
        total:1 // 这里total的值可以随便写，因为后面会被rewrite。
    }
}
//这样可以通过objs搜索每一个变量的名字，更方便。每一个key都是一个变量，冒号后面的内容就是变量里的内容。

let clkConfirmed = null

const unsplashKey = 'mPZCth227d2VCaXxxJuMA2iCr4cjTXPE35XA6_vmlfs'

const strClassSelected = 'selected'   //这里是将selected这个string（也就是后面要用的className打个包，方便后面调取。

objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')  // 选择对象的方法和css格式一样，多加一个引号即可。
objs.btnSearch = document.querySelector('.searchBar button')
objs.gallery = document.querySelector('.gallery')
objs.btnPre = document.querySelector('.prev')
objs.btnNext = document.querySelector('.next')
//此处objs.前面不能再有let或者const了，因为最上面已经用let定义过了。

const cbArrow = evt => {
    if (evt.key === 'ArrowLeft') {
    prevPage()
}
    if (evt.key ==='ArrowRight') {
        nextPage()
    }
}

const cbInput =  evt=> {
    if (evt.key === 'Enter' && objs.inputCity.value.trim().length) {
        fetchData()
    }
}

const setKeyEvent = () => {
    // 非常重要的一点：这个function的框架还是必须要的，也就是 “const setKeyEvent...” 不能少。因为下面数列 “arrCB” 里面的
    // pageNext,pagePre这两个function是在它们“被定义”“之前”就被使用了（在后面90和97行才被定义），如果放在公式外，则会因为未被定义而电脑无法识别，因为在function之外，
    // 电脑只会从上往下阅读，不会去全局地找需要的数据；而在function里，电脑则会去全局找需要的数据。一样的道理，如果将pageNext,pagePre在使用之前先定义，则可以去掉这个function的壳。


    // 此处因为我们已经在线面对以下四条语句进行了打包遍历处理，所以下面四条语句就可以不要了。

    // objs.inputCity.addEventListener('keyup', cbInput)
    // objs.body.addEventListener('keyup', cbArrow)
    // objs.btnNext.addEventListener('click',pageNext)
    // objs.btnPre.addEventListener('click',pagePre)

    let arrEle = [objs.inputCity, objs.body, objs.btnPre,objs.btnNext] // 这里的每一个objs.都是一个element，同时也是变量，每一个变量都是element。
    let evtName = ['keyup', 'keyup','click', 'click'] // 一定要给每一项，即每一个事件加上引号，因为在下面要被纳入addEventListener后面括号里使用，同寻常单条的加事件的指令是一样的道理。
    let arrCB = [cbInput,cbArrow,pageNext,pagePre]

    arrEle.forEach((items, index) => {
        items.addEventListener(evtName[index],arrCB[index])
        // 这里是将多条指令的元素、事件和回调函数通过遍历的方式集合起来。
        // 指令的格式不变，仍然应该是element+method，method的括号里仍然是“事件类型”和“所启动的函数”两个部分.
        // 这里的index表示“从1到3（注意：不是等于3）”，因为被我们遍历的这个数列，即arrEle一共有三项。很像loop。
    })
}

const prevPage = () => {
    if (objs.page.cursor > 1) {
        objs.page.cursor --
        fetchData()
        // 意思是，如果我们所在的页数大于1，则给页数加上1，然后“重新读取新的页面的数据”。fetchData（）不能少，因为必须要重新读取一次数据才会有新的内容呈现。
    }
}

const nextPage = () => {
    if (objs.page.cursor < objs.page.total) {
        objs.page.cursor ++
        fetchData()
        // 意思是，如果我们所在的页数小于最大页数，则给页数减1，然后“重新读取新的页面的数据”。fetchData（）不能少，因为必须要重新读取一次数据才会有新的内容呈现。
    }
}

const pageNext = () => {
    if (objs.page.cursor < objs.page.total) {
        objs.page.cursor ++
        fetchData()
    }
}

const pagePre = () => {
    if (objs.page.cursor > 1) {
        objs.page.cursor --
        fetchData()
    }
}

// “keyup”表示“按键弹起，也是事件的一种“。注意这里的‘Enter’即回车，是按下回车后，在后端（evt）里会自动生成的数据。

// “objs.inputCity.value.trim().length”实际上是一个执行命令，这里是用来判断if的两个条件是否成立，如果第二个条件不成立，则不让电脑进行操作。
const fetchData = () => {
    // objs.preUrl = null
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook'
    fetch(`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query=${newCity}&page=${objs.page.cursor}`)
        // 这里的 “&page=………………” 表示 “我们想要从后端读取“哪一页”的数据“。”objs.page.cursor“ 是”页数“。
        // 这里只是将页数设置成了“三级变量”而已，有三层，我们也可以设置成简单的一级变量，即就一个元素。
        // 注意，必须是我们人为告诉后端“我们要读取第几页”，不是等后端告诉我们读取第几页。所以 “objs.page.cursor” 的值必须是一个数字，才能表示是第几页。值为1则第一页开始读，为10则从第10页开始。
        // 反正记住，每一次做这种project都用变量的形式设置一个页数就可以。
        .then(response => response.json())
        .then(data => {
            //todo: render image carousel
            console.log('data raw', data)
            renderImages(data.results)
//这里就是最原始的“执行某个function”的写法，括号里带参数，后面有function的内容）
// 最终我们要对数据进行的处理其实就是“呈现图片”，所以给这个函数取名renderImages。
// 整个这个block是将数据分成两类，用户类和后端类，分别进行处理。学会这种做法。
            objs.page.total = data.total_pages
            // total_pages  是fetch出来的数据里面自带的一个key，表示获得所有数据一共有多少页。可以在控制台里看到这个key。
            // 这里是在把total_pages，也就是“总页数”的值保存起来。
            // 必须要将总页数的值保存进一个变量中，因为该函数里的data这个词在该函数之外不能够被读取。参考55行。
            // 此处 “objs.page.total” 在网页一打开时就会被重新赋值为 “data.total_pages”的结果，所以上面56行代码用到的值是已经被重新赋过的值了。
        })
}

const renderImages = arrImages => {      // render是呈现的意思，这里分两部分，一个是全屏背景图，一个是10张缩略背景图，缩略图里第一张和全屏图是一个图片，并不冲突。
//set background image with the new data get
//create carousel
//括号里的arrImages表示“即将被替换的参数”，而下面公式内容里的arrImages表示“参数被替换以后，新的参数需要放的位置”。
// 这里在理解的时候，可以将data.results代入公式，替代arrImages来理解。但是，这仅限于理解，我们写的时候还是要写成arrImages，这是我们为data.results的所赋予的一个类型，例如苹果属于水果，这里的data.results就是苹果，arrImages就是水果。
    const img = arrImages[0].urls.full   // 此处的img是一个变量，并非一个element，是用来打包下面要用的链接的。
    objs.body.style.background = `url('${img}') no-repeat center center fixed` //给背景加图片，光这一句话，从语法上来讲就够了，不要专门加一个img的element。
// 注意，这里其实是在“加背景‘，不要纯粹理解成“加图片”。这里是对body加背景。
// 这里是把背景大图和10张缩略图分别说明该如何呈现。 下面的createCarousel这个公式就说明该如何呈现10张缩略图。

    createCarousel(arrImages)   //这个函数的作用是呈现“10张图片”的缩略图，包括第一张全屏图片的缩略图在内。
}

const setImageSelected = eleImage => {
    let images = document.querySelectorAll('[data-index]')
    //[data-index]这种加 “中括号” 的写法，表示“选择所有含有括号内的内容的’tag‘“，data-index属于装图片的<div></div>这个tag的一个attribute，所以即表示“选择所有图片”。也可以换成[data-url]。
    //这里images是指“选择所有内容”。
    images.forEach(items => {     // 接着对选择的所有被选出的tag进行遍历，每一个tag都是一个item。
        items.className = ''   // 即清空掉“所有项目”的className
        }
    )
    eleImage.className = strClassSelected  // 这里的strClassSelected是一个变量，里面是”selected“这个我们要加上的className。对比18行。
    // 这里表示“先清空所有图片box的className“，再针对我们选中的那张图的box添加className。
    // 70行必须写在最后，如果写在前面就变成了”添加后又删除“，没有任何意义。
}
// 这个部分是对照87行的，说明我们要被该target采取什么行动，即加className。
// 点击那个target（即装图片的div），就给这个box加一个className，重复点击也没关系，只会覆盖之前加的，内容一样。
const createCarousel = arrImages => {
    objs.gallery.innerHTML = ''
    // 注意，这里必须有这个“清空innerHTML”的指令，因为我们每一次刷新只需要这一次新的数据的内容（图片），不需要上一次的图片。
    // 下面通过loop的设置使得我们每一次循环都会生成新的10张图片。所以，如果不清楚，图片则会一直累加。
    for(let i = 0; i < arrImages.length; i++) {  // 呈现10张缩略图直接用loop可以完成，因为最终10张后就结束了，不是无限展示新图片。

        let item = document.createElement('div')  // 想创建box即创建div。这里的div是用来装缩略图的。
        item.className = 'imgContainer'

// 此处要注意，虽然我们设置了<div>，也设置了背景，但是因为div本身没有任何大小，其大小取决于里面的内容的大小，而背景的大小取决于这个div的大小，所以这里必须给div设置大小，才能看到背景图片。

        const img = arrImages[i].urls.regular   // 这里的const img不会和上面的let img冲突，不会改变上面img里的链接，因为这个const是在一个loop里面！是独立的。
        item.style.background =  `url('${img}') no-repeat center center fixed`
        // 这里是对10个新创建的box“加背景”,并且，这里将鳖精的链接（url）、重复、居中等指令全部写在一起，记住这种写法。但是这里必须是反引号，因为里面有${}，否则只需单引号即可。
        item.dataset.index = i // 这里的index是我们通过dataset这个指令”新创建的一个‘key’”，这里key里的值就是循环的i的变化的值。
        item.dataset.url = arrImages[i].urls.regular // 有时候url未必代表最终要获取的链接地址，可能还会有更深层的key，所以要注意。
        // dataset这个指令是一个“桥梁”，可以用来对“object”创建任何类型的key，并且新被创建的key可以被赋予“任何内容”，如这里可以即可以赋予“数值”，也可以赋予“链接url”。
        objs.gallery.appendChild(item)

        item.style.animation = 'fadeIn 0.25s'
        // 这里是设置动画，animation也是一种style，和innerText等一样，也需要对它赋值。
        // fadeIn是我们在css里203为该动画取的“名字”；0.25s表示“动画进行的时长”.
        // 有些时候可以再加一个“forwards”，如"fadeIn 0.25s forwards",但这里不可以。因为forwards表示“动画结束后，就保持这个样子，就别再动了，即停留在最后一帧”。但在这里，我们希望动画结束后，图片可以恢复hover的效果（css 65行），所以就冲突了。
        // 对于动画而言，动画的内容（如fateIn）和动画的持续时间（0.25s）是必要的，后面的forwards等是可以不要的。
        item.style.animationDelay = `${0.1 * i}s`
        // 这是给动画设置”延时启动“，0.1表示”0.1秒后启动“，i是这个loop的一个循环值，这里要达到的效果就是”一个接一个启动“，第一张图延迟0.1s，第二张延迟0.2s，以此类推。
        // 这里需要注意时间的一个写法，因为我们需要一个乘法的值，所以需要用上${}这个方式，否则会因为引号被电脑识别为字符串。
        // 这里如果不要animationDelay，则所有图片都会同时运行我们设置的animation，就没有先后顺序了。
        // 有一点不太好理解，就是“第一张图”其实它自己不需要有延迟，因为只能后面的图片针对它延迟运行动画，但是没有办法抛开它单独对后面的图片设置延迟，所以必须也对它设置一个延迟。
        // 最后一点，设置动画这种行为，是很少见的会“直接将js和css”联系起来的行为，像这里，我们直接通过fadeIn调取了css里的动画的内容，这是很少见的。。

        if (i === 0) {
            item.className = strClassSelected
        }
        // 这里表示在每次生成新页面时，将生成的第一个缩略图的box的className设置为selected。这样每次页面刷新第一张图片都会被加上边框。结合第64行的公式来看。
        //需要注意，i === 0表示“第一次循环”，因为该loop里每次循环都创造一个item，在这里即指“对第一次循环创造的item加className“。
        item.addEventListener('click', (evt) => {
            objs.body.style.background = `url('${evt.target.dataset.url}')`
            setImageSelected(evt.target)
            //这里理解为，将evt.target放进setImageSelected这个公式运行，那么接下来我们就要通过回调函数说明这个公式的内容。
            // 这里的target其实指代的就是被我们点击的那张图片的box（即div）。记住：target就是被我们点击（或者触发其它事件）的那个“对象”。如果不确定，就console.log（evn），再点击图片看一下target被我们点击的这个box属于哪个子集即可。
            clkConfirmed = 'clicked'
        })

        item.addEventListener('mouseenter', (evt) => {
            if (!objs.preUrl) {
                // 这里表示，如果objs.preUrl为“没有内容”，则…………，null就等于没有内容。
                // 意思是，第一次切换图片的时候，因为没有上一张图片的记录，所以上一次的链接肯定就是null，那么，则加上将新图片的链接作为链接加上去。
                let str = objs.body.style.background
                // 先将被搜寻的内容打包放进变量。这里background打印出来结果就是一串链接，但是有引号，所以要提取出引号中间的部分。
                let iStart = str.indexOf('"')
                //这里指的是“在str这个变量汇总，提取出”（引号）这个内容。
                // 这里是找第一个需要找的内容，结果需要放进变量才能保存，保存结果是数字，代表”该内容所在的位置“。
                let iEnd = str.indexOf('"', iStart + 1)
                //这里表示“从41这个位置”开始继续往后查找（因为iStart结果是40），结果同样需要保存起来才能用。
                str = str.slice(iStart + 1, iEnd)
                // slice表示“从……中间取出内容”，因为slice规定，括号里左边位置的内容（即取的第一个引号）是会被slice选中的，所以这里我们要后移
                // 一个位置，而括号右边位置所指代的内容则会被slice自动忽略，因此不用-1。
                objs.preUrl = str
            }
            objs.body.style.background = `url('${evt.target.dataset.url}')`

        })

        item.addEventListener('mouseleave', (evt) => {
            if (objs.preUrl &&  clkConfirmed !== 'clicked' ) {    //这里 “objs.preUrl” 表示如果objs.preUrl是“有值的”，则………………，也可以写成 "objs.preUrl !== null" 。
                objs.body.style.background = `url('${objs.preUrl}') no-repeat center center fixed`
                objs.preUrl = null
                // 这里必须要清空objs.preUrl， 因为每一次render新的图片库（搜索后）时，第一张图片的数据都会发生变化。
                // 这个指令不是必须写在这里，也可以写在其它地方，只要能表达“每次读取新的图片库时，清空 objs.preUrl 的数据”即可。如，也可写在36行。
            }
            else {
                clkConfirmed = null   // 这里需要清空变量的值，不然该if条件永远不能成立。
            }

        })
        // 这里不需要用“回调函数”，即不用导向某项函数，所以不需要对函数命名。
        // 这里之所以在loop里面写mouseenter和mouseleave，是因为item是在loop中被创建，item在loop外面是不能被识别的。并且因为时间需要出发才有效，所以也不影响什么。
    }
}
// 通过i（序列号）创建了两个东西：1. 不断变化的“i”这个数值；2.创建了多少个东西。
// 此处这个fetchDta的function，意义是“抓取两部分数据”的意思，分别是newCity和fetch()，分别代表“用户在输入框中输入的内容”，以及需要从后端网页调取的图片。


fetchData()

// 整个“fetchData”这个function是在做两件事：抓取数据（用户输入数据和后端图片数据），以及呈现数据（呈现图片）。

objs.btnSearch.addEventListener('click', fetchData)
//千万注意，这里的fetchDta绝对不能加括号（），因为如果加了括号，变成了fetchDta（），则表示“直接执行“这个function，那么电脑会再哪怕你“不click”，
// 也会执行该function，这就不是回调函数了。恶意这样理解：fetchDta是一个“名词”，而fetchData()是一个“动词”。

setKeyEvent()