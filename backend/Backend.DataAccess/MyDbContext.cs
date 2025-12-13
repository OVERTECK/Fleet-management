using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    public MyDbContext()
        : this(GetOptions())
    {
    }

    private static DbContextOptions<MyDbContext> GetOptions()
    {
        return new DbContextOptionsBuilder<MyDbContext>()
            .UseNpgsql("Username=admin;Password=admin;Host=localhost;Port=5432;Database=car_park_db;")
            .Options;
    }

    public DbSet<CarEntity> Cars { get; set; }

    public DbSet<DriverEntity> Drivers { get; set; }

    public DbSet<GasStationEntity> GasStations { get; set; }

    public DbSet<MaintenanceRecordEntity> MaintenanceRecords { get; set; }

    public DbSet<RouteEntity> Routes { get; set; }

    public DbSet<TargetEntity> Targets { get; set; }

    public DbSet<TripEntity> Trips { get; set; }

    public virtual DbSet<UserEntity> Users { get; set; }

    public DbSet<RoleEntity> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoleEntity>().HasData(
            new RoleEntity { Id = 1, Title = "Водитель" },
            new RoleEntity { Id = 2, Title = "Диспетчер" },
            new RoleEntity { Id = 3, Title = "Администратор" });
    }
}