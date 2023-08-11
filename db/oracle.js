const oracledb = require("oracledb");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

try {
  oracledb.initOracleClient({
    libDir:
      "C:\\Users\\JALLOH1629083\\Node_apps\\policePortal\\libdir\\instantclient_19_11",
  });
} catch (err) {
  console.error("Whoops!");
  console.error(err);
  process.exit(1);
}

// const mypw = ...  // set mypw to the hr schema password

async function run() {

  let connection;
try{
  connection = await oracledb.getConnection({ 
    user: "abangura", 
    password: "vheA4tRlPI", 
    connectionString: "172.25.163.113:1521/ORAEDWADMIN" });

  console.log("Successfully connected to Oracle Database");

  // const result = await connection.execute( `select call_start_date,call_start_time,IMEI,access_method_identifier,Call_duration,call_originating_number,call_terminating_number,ZONE_NAME,SITE_NAME from 

  // ( select call_start_date ,call_start_time,IMEI,access_method_identifier ,call_originating_number,call_terminating_number, lac_id,cell_id,Call_duration
  // FROM DWH_CDR_REPOSITORY_MOBILITY.SERVICE_USAGE_MSC 
  // where call_start_date between '01-DEC-17' and '05-DEC-17' --and left(call_originating_number,2) in ('75','76','78','79','74'73')
  // and ACCESS_METHOD_IDENTIFIER in (76940456) 
  // ) f
  // left join ( 
  //                          select 
  //                          location.lac_id ,
  //                          location.ci_id ,
  //                          dim_geography.ZONE_NAME,
  //    dim_geography.SITE_CODE,
  //                          dim_geography.SITE_NAME,
  //                          dim_geography.geography_skey 
  //                          from dm_bi_mobility.dim_site_geography dim_geography
  //                          inner join dwh_sor.view_cell_site_class_master location
  //                          on dim_geography.site_key = location.site_id
  //                          where '01-DEC-17' between dim_geography.effective_date and coalesce(dim_geography.end_date,current_date)
  //                          and '05-DEC-17' between location.effective_date and coalesce(location.end_date,current_date) 
  //             ) derived_geography 
  //             on f.lac_id = derived_geography.lac_id 
  //             and f.cell_id = derived_geography.ci_id

  //  group by call_start_date, access_method_identifier,ZONE_NAME,SITE_NAME,call_start_time,call_terminating_number,call_originating_number,IMEI,Call_duration
  //  order by count(access_method_identifier) desc`
  // );
  // console.log(JSON.stringify(result.rows));
  } catch (err) {
    console.error("Unable to fetch from Oracle DB!");
    console.error(err);
    process.exit(1);
  }
}
run();





// `select * from DWH_CDR_REPOSITORY_MOBILITY.SERVICE_USAGE_MSC`,






 



 
