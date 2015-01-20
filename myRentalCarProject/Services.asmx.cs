using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace myRentalCarProject
{
    /// <summary>
    /// Summary description for Services
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Services : System.Web.Services.WebService
    {
        private static List<Car> cars = new List<Car>{ 
            new Car { Color = "Red" , IsAvailable = true, LicensePlateNumber ="7395477" , Gear="Manual", Model = "BMW", Year= 2011},
            new Car { Color = "Green" , IsAvailable = true, LicensePlateNumber ="1141277", Gear="Auto", Model = "Ford", Year= 2013},
            new Car { Color = "Blue" , IsAvailable = true, LicensePlateNumber ="4545377", Gear="Auto", Model = "Mazda", Year= 2012},
            new Car { Color = "Pink" , IsAvailable = true, LicensePlateNumber ="2252477", Gear="Manual",  Model = "Mustang", Year= 1967}
        };

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public List<Car> GetAvailableCars()
        {
            return cars.Where(car => car.IsAvailable).ToList();
        }      
      
        [WebMethod]
        public bool RentACar(string license)
        {
            //cars.First(car => car.LicensePlateNumber == license).IsAvailable = false;
            bool isCarExist = false;
            foreach (Car c in cars)
            {
                if (c.LicensePlateNumber == license)
                {
                    c.IsAvailable = false;
                    isCarExist = true;
                }

            }

            return isCarExist;
        }

        [WebMethod]
        public bool ReturnACar(string license)
        {
            bool isCarExist = false;
            foreach (Car c in cars)
            {
                if (c.LicensePlateNumber == license)
                {
                    c.IsAvailable = true;
                    isCarExist = true;
                }
                
            }
            return isCarExist;
        }

    }
}

