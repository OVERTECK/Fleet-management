using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    public DbSet<CarEntity> Cars { get; set; }

    public DbSet<DriverEntity> Drivers { get; set; }

    public DbSet<GasStationEntity> GasStations { get; set; }

    public DbSet<MaintenanceRecordEntity> MaintenanceRecords { get; set; }

    public DbSet<RouteEntity> Routes { get; set; }

    public DbSet<TargetEntity> Targets { get; set; }

    public DbSet<TripEntity> Trips { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}