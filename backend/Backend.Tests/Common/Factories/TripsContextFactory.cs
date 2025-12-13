using Backend.DataAccess;
using Backend.DataAccess.Entities;

namespace Backend.Tests.Common.Factories;

public class TripsContextFactory : BaseContextFactory
{
    public static readonly List<UserEntity> Users = new()
    {
        new()
        {
            Id = Guid.NewGuid(),
            Login = "loginTest1",
            Password = "passwordTest1",
            RoleId = 1
        },

        new()
        {
            Id = Guid.NewGuid(),
            Login = "loginTest2",
            Password = "passwordTest2",
            RoleId = 2
        }
    };
    
    public static readonly List<CarEntity> Cars = new()
    {
        new()
        {
            VIN = "vinTest1",
            Number = "numberTest1",
            Model = "modelTest1",
            Status = "statusTest1",
            TotalKM = 100
        },

        new()
        {
            VIN = "vinTest2",
            Number = "numberTest2",
            Model = "modelTest2",
            Status = "statusTest2",
            TotalKM = 100
        }
    };
    
    public static readonly List<DriverEntity> Drivers = new()
    {
        new()
        {
            Id = Guid.NewGuid(),
            CategoryDrive = "A",
            ContactData = "contactDataTest1",
            Name = "nameTest1",
            LastName = "lastNameTest1",
            Pathronymic = "pathronymicTest1",
        },

        new()
        {
            Id = Guid.NewGuid(),
            CategoryDrive = "B",
            ContactData = "contactDataTest2",
            Name = "nameTest2",
            LastName = "lastNameTest2",
            Pathronymic = "pathronymicTest2",
        }
    };

    public static readonly List<RouteEntity> RoutesTripA = new()
    {
        new()
        {
            Id = Guid.NewGuid(),
            Latitude = 12.1,
            Longitude = 12.2,
            TripId = tripAId
        },

        new()
        {
            Id = Guid.NewGuid(),
            Latitude = 12.2,
            Longitude = 12.3,
            TripId = tripAId
        }
    };
    
    public static readonly List<RouteEntity> RoutesTripB = new()
    {
        new()
        {
            Id = Guid.NewGuid(),
            Latitude = 12.1,
            Longitude = 12.2,
            TripId = tripBId
        },
    };
    
    public static readonly Guid tripAId = Guid.NewGuid();
    public static readonly Guid tripBId = Guid.NewGuid();

    public static readonly List<TripEntity> Trips = new()
    {
        new()
        {
            Id = tripAId,
            CarId = Cars[0].VIN,
            DriverId = Drivers[0].Id,
            TimeEnd = DateTime.Now,
            TimeStart = DateTime.Now,
            TraveledKM = 500,
            CreatedUserId = Users[0].Id,
            ConsumptionLitersFuel = 100,
            Route = RoutesTripA,
            Car = Cars[0],
            Driver = Drivers[0],
        },
        
        new()
        {
            Id = tripBId,
            CarId = Cars[1].VIN,
            DriverId = Drivers[1].Id,
            TimeEnd = DateTime.Now,
            TimeStart = DateTime.Now,
            TraveledKM = 500,
            CreatedUserId = Users[1].Id,
            ConsumptionLitersFuel = 100,
            Route = RoutesTripB,
            Car = Cars[1],
            Driver = Drivers[1],
        }
    };
    
    protected override void SeedData(MyDbContext context)
    {
        context.Users.AddRangeAsync(Users);
        context.Cars.AddRangeAsync(Cars);
        context.Drivers.AddRangeAsync(Drivers);
        context.Routes.AddRangeAsync(RoutesTripA);
        context.Routes.AddRangeAsync(RoutesTripB);
        context.Trips.AddRangeAsync(Trips);

        context.SaveChangesAsync();
    }
}