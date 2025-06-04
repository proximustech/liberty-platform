var app = {
    md:{}, //module_data. used for any porpouse by the loaded module
    drawer:document.getElementById("app_drawer"),
    dialog:document.getElementById("app_dialog"),
    wideScreenMinPixels : 992,
      top_menu : document.getElementById("top_menu"),
      modules_menu : document.getElementById("modules_menu"),
      app_menu_visible : false,
      temp_selected_element_for_detail:{},
      modal_window : {},
      append : (parentId,childId) => {
          let parent = document.getElementById(parentId)
          let child = document.getElementById(childId)
          parent.append(child)
          child.style.display = "block"
      },
      prepend : (parentId,childId)=> {
          let parent = document.getElementById(parentId)
          let child = document.getElementById(childId)
          parent.prepend(child)
          child.style.display = "block"
      },

      vibrate : () => {
        if (app.isSmallScreen()) {
          try{navigator.vibrate(35);}catch{}
        }
      },
      toggleBar : (vibrate=true) => {
        if (vibrate) {
          app.vibrate()
        }
        app.app_menu_visible = !app.app_menu_visible
        app.resizeContetView({})
      },

      openDetail: (element) => {
        try {
          app.closeDetail()
        } catch (error) {}
        app.temp_selected_element_for_detail = element.cloneNode(true)
        const detail = document.getElementById("detail_model").cloneNode(true);
        detail.id="item_detail"
        detail.style.display="block"
        element.outerHTML = detail.outerHTML
        setTimeout(()=>{document.getElementById("item_detail").style.opacity="1"},0)
          
      },
      closeDetail : () => {      
        const detaill = document.getElementById("item_detail");
        detaill.outerHTML = app.temp_selected_element_for_detail.outerHTML
      },
      loadDetail : (html) => {
          const detaill = document.getElementById("item_detail");
          detaill.insertAdjacentHTML("beforeend",html)
      },
      breadCrumbsMap : new Map(),
      addBreadCrumb : (targetId,url,label="*",reset=false) => {
        if (reset) {
          app.breadCrumbsMap = new Map()
        }
        if (app.breadCrumbsMap.has(targetId)) {
          targetHistory = app.breadCrumbsMap.get(targetId)
          targetHistory.push({
            label:label,
            url:url
          })
          // Only allow 5 elements in history
          if (targetHistory.length > 5) {
            targetHistory.shift()
          }
          app.breadCrumbsMap.set(targetId,targetHistory)
        }
        else{
          app.breadCrumbsMap.set(targetId,[{
            label:label,
            url:url
          }])
        }
      },
      popBreadCrumb : (targetId,position=undefined) => {
        let url = ""
        if (app.breadCrumbsMap.has(targetId)) {
          targetHistory = app.breadCrumbsMap.get(targetId)                
          if (typeof position == 'undefined'){
            url = targetHistory.pop().url
          }
          else {
            targetHistoryLength = targetHistory.length  
            for (let positionIndex = position + 1; positionIndex < targetHistoryLength; positionIndex++) {
              //remove unnecessary elements
              url = targetHistory.pop().url
            } 
          }

          app.breadCrumbsMap.set(targetId,targetHistory)
        }
        return url
      },
      reloadLastBreadCrumb : (targetId) => {
        let lastUrl = ""
        try {
          lastUrl = app.breadCrumbsMap.get(targetId)[app.breadCrumbsMap.get(targetId).length - 1].url
        } catch (error) {}
        app.ajax(targetId,lastUrl)
      },
      renderBreadCrumbs : (renderTargetId,breadCrumbTargetId) => {
        let html=''
        let targetHistory = app.breadCrumbsMap.get(breadCrumbTargetId)
        let breadCrumbIndex = 0
        targetHistory.forEach(breadCrumb => {
          let label = breadCrumb.label
          if (label=="*") {
            label='<i class="bi bi-box-fill"></i>'
          }          
          html+=`<span class="badge text-bg-secondary" onclick="app.popBreadCrumb('${breadCrumbTargetId}',${breadCrumbIndex});app.ajax('${breadCrumbTargetId}','${breadCrumb.url}','${breadCrumb.label}')">${label}</span> ` 
          breadCrumbIndex++
        });
        document.getElementById(renderTargetId).innerHTML=html

      }
  }

  app.setSmartTable = (tableId) => {
    $('#'+tableId).bootstrapTable()
    document.getElementsByClassName("fixed-table-body")[0].classList.remove("fixed-table-body")
    document.getElementsByClassName("loading-text")[0].innerHTML=""
  }            

  app.toastShow = (title,body,options = {}) => {

    app.vibrate()

    const toastsContainer = document.getElementById('toasts_container')
    let toastIdex=toastsContainer.childElementCount

    let html = `
      <div id="app_toast_${toastIdex}" role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
        <div id="app_toast_header_${toastIdex}" class="toast-header"></div>
        <div id="app_toast_body_${toastIdex}" class="toast-body" style="background-color: white !important"></div>
      </div>              
    `
    toastsContainer.insertAdjacentHTML("beforeend",html)
    const toastElement = document.getElementById(`app_toast_${toastIdex}`)
    const toast = bootstrap.Toast.getOrCreateInstance(toastElement)

    const toastHeader = document.getElementById(`app_toast_header_${toastIdex}`)
    const toastBody = document.getElementById(`app_toast_body_${toastIdex}`)
    let timeout = 4000
    let autohide = false

    toastHeader.style.backgroundColor="white"
    toastHeader.style.color="black"

    toastHeader.innerHTML=`<strong class="me-auto">${title}</strong>`
    toastBody.innerHTML=`<div>${body}</div>`
    
    let closeIconColor="black"

    if ('type' in options){
      if (options['type']=='success') {
        toastHeader.insertAdjacentHTML("afterbegin",`<i class="bi bi-chat-dots" style="margin-right:10px"></i>`)
        toastHeader.style.backgroundColor=`var(--main-contrast-color)`
        toastHeader.style.color="white"
      }
      if (options['type']=='info') {
        toastHeader.insertAdjacentHTML("afterbegin",`<i class="bi bi-chat-dots" style="margin-right:10px"></i>`)
        toastHeader.style.backgroundColor="rgb(119, 201, 220)"
        toastHeader.style.color="black"
      }                
      if (options['type']=='warning') {
        toastHeader.insertAdjacentHTML("afterbegin",`<i class="bi bi-exclamation-triangle" style="margin-right:10px"></i>`)
        toastHeader.style.backgroundColor="#c7bb02"
      }
      if (options['type']=='error') {
        toastHeader.insertAdjacentHTML("afterbegin",`<i class="bi bi-cloud-lightning-fill" style="margin-right:10px"></i>`)
        toastHeader.style.backgroundColor="#c72702"
        toastHeader.style.color="wheat"
        closeIconColor="wheat"
      }

    }

    if ('closable' in options){
      if (options['closable']==true) {
        toastHeader.insertAdjacentHTML("beforeend",`<span id="toast_close_button" style="font-size:large;color:${closeIconColor}" aria-label="Close" onclick="document.getElementById('toasts_container').removeChild(document.getElementById('app_toast_${toastIdex}'))"><i class="bi bi-x-circle"></i></span>`)
      }
      else autohide = true
    } else autohide = true
    if ('timeout' in options){
      timeout = options['timeout']
    }
    if ('autohide' in options || autohide){
      if (options['autohide']==true || autohide) {
        setTimeout(
          ()=>{
            toast.hide();
            setTimeout(()=>{
              toastsContainer.removeChild(toastElement)
            },timeout) 
          },
          timeout
        )
      }
    }

    toast.show()
  }

  app.setElementForPendingOperation = (element) => {
        element.insertAdjacentHTML("afterbegin",`<span class="spinner-border spinner-border-sm" aria-hidden="true" style="margin-right: 7px"></span>`)
        element.disabled = true
  }
  app.unsetElementForPendingOperation = (element) => {
        element.removeChild(element.firstChild)
        element.disabled = false
  }
  app.setViewForPendingOperation = (id,height='90%') => {
        let element = document.getElementById(id)
        element.innerHTML=`
        <div style="text-align:center">
          <div style="height: ${height}"></div>
          <div class="spinner-grow text-secondary" role="status"></div>
        </div>
        `
  }

  app.top_menu.s_prepend = (childId) => {
        app.prepend(app.top_menu.id,childId)
  }
   
  app.top_menu.s_prependItem = (title,link) => {
    let html = `<li><a class="dropdown-item" href="${link}">${title}</a></li>`
    app.top_menu.insertAdjacentHTML("afterbegin",html)
  } 

  app.modules_menu.bootstrap_s_appendItem = (title,module_name,innerHtml) => {
    // Chcek This item will be the first item in order to show the content
    let headerCollapsed = "collapsed"
    let show = ""
    if (app.modules_menu.innerHTML==="") {
      headerCollapsed = ""
      show="show"
    }

    let html = `
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button ${headerCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#${module_name}_module_menu" aria-expanded="false" aria-controls="${module_name}_module_menu">
            ${title}
          </button>
        </h2>
        <div id="${module_name}_module_menu" class="accordion-collapse collapse ${show}">
          <div class="accordion-body">
            ${innerHtml}
          </div>
        </div>
      </div>              
    `
    app.modules_menu.insertAdjacentHTML("beforeend",html)
    try{
      document.getElementById(`${module_name}_module_menu_content`).style.display="block"
    }catch{}
  }
  app.modules_menu.s_appendItem = (title,module_name,innerHtml) => {
    // Chcek This item will be the first item in order to show the content
    let open = ""
    if (app.modules_menu.innerHTML==="") {
      open="open"
    }

    let html = `
    <div style="box-shadow:var(--effect-outstandig-box-shadow)">
      <sl-details ${open}>
        <span slot="summary">${title}</span>
        ${innerHtml}
      </sl-details>
    </div>
    <div style="height:5px"></div>
    `
    app.modules_menu.insertAdjacentHTML("beforeend",html)
    try{
      document.getElementById(`${module_name}_module_menu_content`).style.display="block"
      document.getElementById(`${module_name}_module_menu_content`).style.boxShadow="2px 2px 2px rgba(0, 0, 0, 0.2)"
    }catch{}
  }
  app.confirmDelete = (title,body,deleteFunctionCall) => {
    app.dialog.innerHTML=body
    app.dialog.label=title
    app.dialog.insertAdjacentHTML('beforeend',`
      <div slot="footer">
        <button type="button" class="btn btn-secondary" onclick="app.dialog.hide()">Close</button>
        <button type="button" class="btn btn-danger" onclick="${deleteFunctionCall};app.setElementForPendingOperation(this)">Delete</button>
      </div>
    `)
    app.dialog.show()
  }  
  app.ajax = (targetId,url,label="*",resetBreadCrumbsMap=false) => {
    if (targetId=="content_view") {
      app.setModuleTitle(`<i class="bi bi-smartwatch"></i>`)
    }
    app.setViewForPendingOperation(targetId)
    $.ajax({
        type:"GET",
        url:url,
        dataType:"html"
    })
    .done(function(httpResponse) {
        if (httpResponse==="app.event.logged_out") {
          window.onbeforeunload = (event) => {}
          window.location.replace("/login?event=logged_out")
        }
        else {
          if (targetId=="content_view") {
            app.setModuleTitle(`<i class="bi bi-box-fill"></i>`)
          }
          document.getElementById(targetId).style.display="none"
          $('#'+targetId).html(httpResponse).fadeIn(300);
          if (targetId=="content_view") {
            if (url.includes("search_value")) {
              try {
                let lastUrl = app.breadCrumbsMap.get(targetId)[app.breadCrumbsMap.get(targetId).length - 1].url
                if (lastUrl.includes("search_value")) {
                  app.popBreadCrumb(targetId)
                }
              } catch (error) {}
            }
            try {
              if (app.breadCrumbsMap.get("content_view")[app.breadCrumbsMap.get("content_view").length - 1].url !== url) {
                app.addBreadCrumb(targetId,url,label,resetBreadCrumbsMap)
              }
              
            } catch (error) {
              app.addBreadCrumb(targetId,url,label,resetBreadCrumbsMap)
            }
          }
        }
    })
    .fail(function(error) {
      try {
        let toastTitle = "Error"
        const jsonResponse= JSON.parse(error.responseText)
        const toastBody = jsonResponse.messages[0].message

        document.getElementById(targetId).innerHTML=""
        app.setModuleTitle(``)
        app.toastShow(toastTitle,toastBody,{type:"error"})
      } catch (error) {
        document.getElementById(targetId).innerHTML=""
        app.setModuleTitle(``)
        app.toastShow('Functional Error','There is some error receiving the response from the server',{type:"error"})
        
      }
    })

  } 

  app.app_menu_inteligentClose = () => {
    //Close app menu automatically in small screen devices
    if (app.isSmallScreen()) {
      setTimeout(()=>{app.toggleBar(false)},500)
    }
  }

  app.graphShowPie = (containerId,dataArray) => {

    am5.ready(function() {

      am5.array.each(am5.registry.rootElements, 
        function(root) {
          if (typeof root !== 'undefined'){
            if (root.dom.id == containerId) {
                root.dispose();
            }
          }
        }
      );

      let root = am5.Root.new(containerId);
      let themes = []
      themes.push(am5themes_Kelly.new(root))
      themes.push(am5themes_Animated.new(root))
      if (app.isSmallScreen()) {
          themes.push(am5themes_Responsive.new(root))
      }
      root.setThemes(themes);

              
      let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
          endAngle: 270
      }));

      let series = chart.series.push(
      am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          endAngle: 270,
          alignLabels: true
      }));
      
      series.labels.template.set("text", "{category}: ({value}) [bold]{valuePercentTotal.formatNumber('0.0')}%");        
      
      series.states.create("hidden", {
          endAngle: -90
      });
      
      series.data.setAll(dataArray  );
      series.appear(1000, 100);

    })
  }


  app.graphShowBars = (containerId,dataArray) => {
    
    am5.ready(function() {

    am5.array.each(am5.registry.rootElements, 
      function(root) {
        if (typeof root !== 'undefined'){
          if (root.dom.id == containerId) {
              root.dispose();
          }
        }
      }
    );


    let root = am5.Root.new(containerId);
    let themes = []
    themes.push(am5themes_Kelly.new(root))
    themes.push(am5themes_Animated.new(root))
    if (app.isSmallScreen()) {
        themes.push(am5themes_Responsive.new(root))
    }
    root.setThemes(themes);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yRenderer = am5xy.AxisRendererY.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    });

    yRenderer.grid.template.set("location", 1);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance:70
        })
      })
    );


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Category",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "category",
      sequencedInterpolation: true,

    }));

    series.columns.template.setAll({
      height: am5.percent(70)
    });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomY"
    }));

    cursor.lineX.set("visible", false);

    yAxis.data.setAll(dataArray);
    series.data.setAll(dataArray);

    series.appear();
    chart.appear(1000, 100);

    });            

  }  

  app.isSmallScreen = () => {
    let isSmall = false
    if ($(window).width() < app.wideScreenMinPixels) {
      isSmall=true
    }
    return isSmall
  }             
  app.escapeHTML = (s) => {
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }
  app.setModuleTitle = (
    title,html=`
      <div id="app.moduleTitle" class="lp_module_title"></div>              
    `
  ) => {
    let headerBar = document.getElementById("app.headerBar")
    if (app.isSmallScreen()) {
      headerBar.style.width="50%"
    } else {
      headerBar.style.width="85%"
    }
    headerBar.innerHTML=html
    let moduleTitle = document.getElementById("app.moduleTitle")
    moduleTitle.innerHTML=`<center>${title}</center>`
  }

  app.resizeContetView=(event)=>{
    let contentViewWidthDiffPixels = 220
    //Mantaining content ViewWidth in small screen devices
    if (app.isSmallScreen()) {
      contentViewWidthDiffPixels = 0
    }
    if (app.app_menu_visible) {
      document.getElementById("content_view").style.marginLeft = "226px";
      document.getElementById("content_view").style.width = window.window.innerWidth  - contentViewWidthDiffPixels - 10;
      document.getElementById("app_menu").style.width= "220px";
      if (app.isSmallScreen()) {
        try {app.drawer.hide()} catch (error) {}
      }                
    } else {
      document.getElementById("content_view").style.marginLeft= "6px";
      document.getElementById("content_view").style.width = window.window.innerWidth - 10;
      document.getElementById("app_menu").style.width= "0px";
    }              
  }

  app.renderListNavigationBar=(elementId,listPagesTotalNumber,listPageNumber,sourceUrl,searchValue)=>{
    startDisabled = ""
    endDisabled = ""

    if (listPageNumber == 1) {
      startDisabled="disabled='disabled'"
    }
    if (listPageNumber == listPagesTotalNumber) {
      endDisabled="disabled='disabled'"
    }

    element = document.getElementById(elementId);

    separator="?"
    if (sourceUrl.includes('?')) {
      separator='&'
    }
    element.innerHTML=`
      <center>
        <button class="lp_button" onclick="app.ajax('content_view','${sourceUrl}${separator}list_page_number=1&search_value=${searchValue}')" ${startDisabled}><i class="bi bi-skip-start-fill"></i></button> 
        <button class="lp_button" onclick="app.ajax('content_view','${sourceUrl}${separator}list_page_number=${listPageNumber - 1}&search_value=${searchValue}')" ${startDisabled}><i class="bi bi-rewind-fill"></i></button>
        <label style="font-size:small">${listPageNumber}/${listPagesTotalNumber}</label>  
        <button class="lp_button" onclick="app.ajax('content_view','${sourceUrl}${separator}list_page_number=${listPageNumber + 1}&search_value=${searchValue}')" ${endDisabled}><i class="bi bi-fast-forward-fill"></i></button> 
        <button class="lp_button" onclick="app.ajax('content_view','${sourceUrl}${separator}list_page_number=${listPagesTotalNumber}&search_value=${searchValue}')" ${endDisabled}><i class="bi bi-skip-end-fill"></i></button>     
      </center>
    ` 
  }

  app.ajaxOnPressedKey = (event,triggerKeyCode,targetId,url) =>{
    var pressedKeyCode = event.keyCode || event.which;
    if (pressedKeyCode === triggerKeyCode || triggerKeyCode === "all") {
        app.ajax(targetId,url)
    }
  } 
